import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/apiClient";
import BlogEditor from "@/components/blogEditor/BlogEditor";
import TagInput from "@/components/blogEditor/TagInput";
import ImageWithToolbar from "@/components/blogEditor/ImageWithToolbar";
import DraftConflictPrompt from "@/components/blogEditor/DraftConflictPrompt";
import useBlogEditorDraft, {
  isEmptyContent,
  randomDraftId,
} from "@/hooks/useBlogEditorDraft";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || "auto",
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      align: {
        default: "center",
        parseHTML: () => "center",
        renderHTML: () => ({
          "data-align": "center",
          class: "align-center rounded-lg",
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageWithToolbar);
  },
});

const extensions = [
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  Highlight,
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) =>
      node.type.name === "heading" ? "Title..." : "Tell your story...",
    showOnlyWhenEditable: true,
    showOnlyCurrent: false,
  }),
  CustomImage,
];

const CreateEditBlog = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const isEditMode = !!blogId;

  const { loadDraft, saveDraft, clearDraft, isMeaningfulDraft } =
    useBlogEditorDraft();

  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [draftId, setDraftId] = useState("");
  const [initialContent, setInitialContent] = useState("<p></p>");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pendingBlogId, setPendingBlogId] = useState(null);
  const [showDraftConflict, setShowDraftConflict] = useState(false);
  const [conflictingDraft, setConflictingDraft] = useState(null);

  const lastSavedDraft = useRef({
    html: "",
    title: "",
    tags: [],
    coverImageUrl: "",
  });

  const loadEditorState = useCallback((data) => {
    setTitle(data?.title || "");
    setSelectedTags(data?.tags || []);
    setCoverImageUrl(data?.coverImageUrl || data?.cover_image || "");
    setDraftId(data?.draftId || data?.draft_id || randomDraftId());
    setInitialContent(data?.html || data?.content || "<p></p>");

    lastSavedDraft.current = {
      html: data?.html || data?.content || "<p></p>",
      title: data?.title || "",
      tags: data?.tags || [],
      coverImageUrl: data?.coverImageUrl || data?.cover_image || "",
    };
  }, []);

  const fetchBlogById = useCallback(async (id) => {
    const res = await api.get(`/blogs/${id}`);
    return res?.data;
  }, []);

  const editor = useEditor(
    {
      extensions,
      autofocus: "start",
      content: initialContent,
      editorProps: {
        attributes: {
          class:
            "focus:outline-none prose dark:prose-invert prose-lg max-w-3xl mx-auto py-12 px-4",
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor?.getHTML();

        const hasContentChanged =
          html !== lastSavedDraft.current.html ||
          title !== lastSavedDraft.current.title ||
          coverImageUrl !== lastSavedDraft.current.coverImageUrl ||
          JSON.stringify(selectedTags) !==
            JSON.stringify(lastSavedDraft.current.tags);

        if (hasContentChanged) {
          setDirty(true);
        }
      },
    },
    [initialContent, isDraftLoaded, title, coverImageUrl, selectedTags],
  );

  const handleContinueCurrentDraft = () => {
    setShowDraftConflict(false);
    setPendingBlogId(null);

    if (conflictingDraft) {
      loadEditorState(conflictingDraft);
    }
  };

  const handleDiscardAndOpenBlog = useCallback(async () => {
    try {
      setShowDraftConflict(false);
      await clearDraft(true);

      if (!pendingBlogId) return;

      const blog = await fetchBlogById(pendingBlogId);

      loadEditorState({
        ...blog,
        blogId: blog?.id,
        mode: "edit",
      });

      saveDraft({
        draftId: blog?.draft_id,
        blogId: blog?.id,
        mode: "edit",
        title: blog?.title || "",
        tags: blog?.tags || [],
        coverImageUrl: blog?.cover_image || "",
        html: blog?.content || "<p></p>",
      });

      setPendingBlogId(null);
      setConflictingDraft(null);
    } catch (err) {
      console.error("Failed to discard draft and open blog:", err);
      toast.error("Failed to open blog");
    }
  }, [clearDraft, pendingBlogId, fetchBlogById, loadEditorState, saveDraft]);

  const handleSaveDraftToDbAndOpenBlog = useCallback(async () => {
    try {
      if (!conflictingDraft) return;

      const extractedTitle = conflictingDraft?.title?.trim();
      const html = conflictingDraft?.html || "<p></p>";

      if (!extractedTitle || isEmptyContent(html)) {
        toast.error(
          "Current draft is incomplete. Please continue or discard it.",
        );
        return;
      }

      const payload = {
        title: extractedTitle,
        content: html,
        tags: conflictingDraft?.tags || [],
        coverImageUrl: conflictingDraft?.coverImageUrl || "",
        read_time: Math.ceil(
          html
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/).length / 200,
        ),
        is_published: false,
        is_public: true,
        draftId: conflictingDraft?.draftId,
      };

      if (conflictingDraft?.blogId) {
        await api.put(`/blogs/${conflictingDraft.blogId}`, payload);
      } else {
        await api.post("/blogs", payload);
      }

      toast.success("Draft saved successfully");
      await handleDiscardAndOpenBlog();
    } catch (err) {
      console.error("Failed to save conflicting draft:", err);
      toast.error("Failed to save current draft");
    }
  }, [conflictingDraft, handleDiscardAndOpenBlog]);

  useEffect(() => {
    const initEditor = async () => {
      try {
        const localDraft = loadDraft();

        if (!isEditMode) {
          if (localDraft && isMeaningfulDraft(localDraft)) {
            loadEditorState(localDraft);
          } else {
            if (localDraft && !isMeaningfulDraft(localDraft)) {
              await clearDraft(true);
            }

            const newDraftId = randomDraftId();

            loadEditorState({
              draftId: newDraftId,
              blogId: null,
              mode: "create",
              title: "",
              tags: [],
              coverImageUrl: "",
              html: "<p></p>",
            });

            saveDraft({
              draftId: newDraftId,
              blogId: null,
              mode: "create",
              title: "",
              tags: [],
              coverImageUrl: "",
              html: "<p></p>",
            });
          }

          setIsDraftLoaded(true);
          return;
        }

        if (!localDraft || !isMeaningfulDraft(localDraft)) {
          if (localDraft && !isMeaningfulDraft(localDraft)) {
            await clearDraft(true);
          }

          const blog = await fetchBlogById(blogId);

          loadEditorState({
            ...blog,
            blogId: blog?.id,
            mode: "edit",
          });

          saveDraft({
            draftId: blog?.draft_id,
            blogId: blog?.id,
            mode: "edit",
            title: blog?.title || "",
            tags: blog?.tags || [],
            coverImageUrl: blog?.cover_image || "",
            html: blog?.content || "<p></p>",
          });

          setIsDraftLoaded(true);
          return;
        }

        if (localDraft?.blogId === blogId) {
          loadEditorState(localDraft);
          setIsDraftLoaded(true);
          return;
        }

        setConflictingDraft(localDraft);
        setPendingBlogId(blogId);
        setShowDraftConflict(true);
        setIsDraftLoaded(true);
      } catch (err) {
        console.error("Failed to initialize editor:", err);
        toast.error("Failed to load editor");
        navigate(-1);
      }
    };

    initEditor();
  }, [
    blogId,
    isEditMode,
    loadDraft,
    saveDraft,
    clearDraft,
    loadEditorState,
    fetchBlogById,
    isMeaningfulDraft,
    navigate,
  ]);

  useEffect(() => {
    if (!editor || !isDraftLoaded) return;

    const interval = setInterval(() => {
      const html = editor.getHTML();

      if (!dirty) return;

      const draftData = {
        draftId,
        blogId: isEditMode ? blogId : null,
        mode: isEditMode ? "edit" : "create",
        html,
        title,
        tags: selectedTags,
        coverImageUrl,
      };

      const saved = saveDraft(draftData);

      if (saved) {
        lastSavedDraft.current = {
          html: saved.html,
          title: saved.title,
          tags: saved.tags,
          coverImageUrl: saved.coverImageUrl,
        };
        setDirty(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    editor,
    isDraftLoaded,
    dirty,
    draftId,
    blogId,
    isEditMode,
    title,
    selectedTags,
    coverImageUrl,
    saveDraft,
  ]);

  const handlePreview = () => {
    if (!editor) return;

    const html = editor.getHTML();

    const blog = {
      title,
      content: html,
      tags: selectedTags,
      coverImageUrl,
      read_time: Math.ceil(
        html
          .replace(/<[^>]*>/g, " ")
          .trim()
          .split(/\s+/).length / 200,
      ),
    };

    navigate("/preview", { state: blog });
  };

  const saveBlog = async (status = "draft") => {
    if (!editor || saving) return;

    const html = editor.getHTML();
    const extractedTitle = title.trim();

    if (!extractedTitle || isEmptyContent(html)) {
      toast.error("Title and content are required.");
      return;
    }

    const payload = {
      title: extractedTitle,
      content: html,
      tags: selectedTags,
      coverImageUrl,
      read_time: Math.ceil(
        html
          .replace(/<[^>]*>/g, " ")
          .trim()
          .split(/\s+/).length / 200,
      ),
      is_published: status === "published",
      is_public: true,
      draftId,
    };

    try {
      setSaving(true);

      let res;
      if (isEditMode) {
        res = await api.put(`/blogs/${blogId}`, payload);
      } else {
        res = await api.post("/blogs", payload);
      }

      if (res?.status === 200 || res?.status === 201) {
        toast.success(
          isEditMode
            ? "Blog updated successfully"
            : status === "published"
              ? "Blog published!"
              : "Draft saved.",
        );

        await clearDraft(false);
        isEditMode ? navigate(`/dashboard/posts/${blogId}`) : navigate("/");
      }
    } catch (err) {
      console.error("Save blog error:", err);
      toast.error("Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  if (showDraftConflict) {
    return (
      <DraftConflictPrompt
        draft={conflictingDraft}
        onContinue={handleContinueCurrentDraft}
        onDiscard={handleDiscardAndOpenBlog}
        onSaveToDb={handleSaveDraftToDbAndOpenBlog}
      />
    );
  }

  if (!isDraftLoaded || !editor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading draft...</div>
      </div>
    );
  }

  return (
    <div>
      <BlogEditor
        editor={editor}
        title={title}
        setTitle={setTitle}
        draftId={draftId}
        coverImageUrl={coverImageUrl}
        setCoverImageUrl={setCoverImageUrl}
      />

      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      <div className="p-4 flex flex-wrap justify-end gap-2 mt-2">
        <Button variant="outline" onClick={handlePreview} disabled={saving}>
          Preview
        </Button>

        <Button
          variant="outline"
          onClick={() => saveBlog("draft")}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Draft"}
        </Button>

        <Button onClick={() => saveBlog("published")} disabled={saving}>
          {saving ? "Saving..." : isEditMode ? "Update Blog" : "Save & Publish"}
        </Button>
      </div>
    </div>
  );
};

export default CreateEditBlog;
