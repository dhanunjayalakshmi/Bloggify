import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import api from "@/lib/apiClient";
import { toast } from "sonner";
import BlogEditor from "@/components/blogEditor/BlogEditor";
import TagInput from "@/components/blogEditor/TagInput";
import Image from "@tiptap/extension-image";
import ImageWithToolbar from "@/components/blogEditor/ImageWithToolbar";
import { deleteDraftImages } from "@/services/blogStorage";

// --- Utility to detect real empty editor content ---
const isEmptyContent = (html) => {
  if (!html || html === "<p></p>" || html.trim() === "") return true;
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
};

// Check if there are any images in the HTML content
const hasImagesInContent = (html) => {
  if (!html) return false;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.querySelectorAll("img").length > 0;
};

// Combined check for draft emptiness: no meaningful text content, no title, and no images
const isDraftEmpty = (html, title, coverImageUrl) => {
  return (
    isEmptyContent(html) &&
    !title.trim() &&
    !hasImagesInContent(html) &&
    !coverImageUrl
  );
};

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

const randomDraftId = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1)) & (15 >> (c / 4)))
    ).toString(16),
  );
};

const DRAFT_KEY = "blog-editor-draft";

const CreateEditBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [draftId, setDraftId] = useState("");
  const [initialContent, setInitialContent] = useState("<p></p>");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [pendingBlogId, setPendingBlogId] = useState(null);
  const [showDraftConflict, setShowDraftConflict] = useState(false);
  const [conflictingDraft, setConflictingDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const draftWasReset = useRef(false);

  const { blogId } = useParams();
  const isEditMode = !!blogId;

  const [dirty, setDirty] = useState(false);
  const lastSavedDraft = useRef({
    html: "",
    title: "",
    tags: [],
    coverImageUrl: "",
  });

  // Load draft data from localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);

      if (!savedDraft) return null;

      const parsed = JSON.parse(savedDraft);
      return {
        blogId: parsed?.blogId || null,
        mode: parsed?.mode || "create",
        html: parsed.html || "<p></p>",
        title: parsed.title || "",
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        coverImageUrl: parsed.coverImageUrl || "",
        draftId: parsed.draftId || randomDraftId(),
        lastUpdated: parsed?.lastUpdated || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to parse saved draft:", error);
      return null;
    }
  }, []);

  // Save draft data to localStorage
  const saveDraft = useCallback((data) => {
    try {
      const normalizedDraft = {
        draftId: data?.draftId || randomDraftId(),
        blogId: data?.blogId || null,
        mode: data?.mode || "create",
        html: data?.html || "<p></p>",
        title: data?.title || "",
        tags: Array.isArray(data?.tags) ? data.tags : [],
        coverImageUrl: data?.coverImageUrl || "",
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(normalizedDraft));

      lastSavedDraft.current = {
        html: normalizedDraft?.html,
        title: normalizedDraft?.title,
        tags: normalizedDraft?.tags,
        coverImageUrl: normalizedDraft?.coverImageUrl,
      };
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, []);

  const clearDraft = useCallback(async () => {
    const draft = loadDraft();

    localStorage.removeItem(DRAFT_KEY);

    if (draft?.draftId) {
      await deleteDraftImages(draft.draftId);
    }
  }, [loadDraft]);

  const isMeaningfulDraft = useCallback((draft) => {
    if (!draft) return false;

    return !isDraftEmpty(
      draft?.html || "<p></p>",
      draft?.title || "",
      draft?.coverImageUrl || "",
    );
  }, []);

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

  // Load draft on mount BEFORE editor initialization
  useEffect(() => {
    const initEditor = async () => {
      try {
        const localDraft = loadDraft();

        if (!isEditMode) {
          if (localDraft && isMeaningfulDraft(localDraft)) {
            loadEditorState(localDraft);
          } else {
            if (localDraft && !isMeaningfulDraft(localDraft)) {
              localStorage.removeItem(DRAFT_KEY);
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

        // Edit mode
        if (!localDraft || !isMeaningfulDraft(localDraft)) {
          if (localDraft && !isMeaningfulDraft(localDraft)) {
            localStorage.removeItem(DRAFT_KEY);
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
    loadEditorState,
    fetchBlogById,
    isMeaningfulDraft,
    navigate,
  ]);

  // onUpdate handler to mark dirty only if content or title/tags/cover changed
  const onUpdate = ({ editor }) => {
    const html = editor?.getHTML();

    const hasContentChanged =
      html !== lastSavedDraft?.current?.html ||
      title !== lastSavedDraft?.current?.title ||
      coverImageUrl !== lastSavedDraft?.current?.coverImageUrl ||
      JSON.stringify(selectedTags) !==
        JSON.stringify(lastSavedDraft?.current?.tags);

    if (hasContentChanged) {
      setDirty(true);
    }
  };

  // Initialize editor AFTER draft is loaded
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
      onUpdate,
    },
    [initialContent, isDraftLoaded],
  );

  // --- Updated Auto-save logic including cleanup ---
  useEffect(() => {
    if (!editor || !isDraftLoaded) return;

    const interval = setInterval(async () => {
      if (draftWasReset?.current) return;

      const html = editor?.getHTML();
      const contentIsEmpty = isDraftEmpty(html, title, coverImageUrl);

      if (dirty || contentIsEmpty) {
        if (contentIsEmpty) {
          localStorage.removeItem(DRAFT_KEY);

          await deleteDraftImages(draftId);

          // Reset to new draft (without triggering editor re-mount if possible)
          const newDraftId = randomDraftId();
          setDraftId(newDraftId);
          setTitle("");
          setSelectedTags([]);
          setCoverImageUrl("");
          setInitialContent("<p></p>");
          setIsDraftLoaded(true);
          setDirty(false);
          // toast.info("Empty draft deleted. Starting a new draft.");
          draftWasReset.current = true;
          return;
        }

        // Otherwise, save as usual
        const draftData = {
          blogId: isEditMode ? blogId : null,
          mode: isEditMode ? "edit" : "create",
          html,
          title,
          tags: selectedTags,
          coverImageUrl,
          draftId,
          lastUpdated: new Date().toISOString(),
        };
        saveDraft(draftData);
        setDirty(false);
        console.log("Auto-saved draft");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    editor,
    isDraftLoaded,
    title,
    selectedTags,
    coverImageUrl,
    draftId,
    dirty,
    saveDraft,
  ]);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${blogId}`);

        const blog = res?.data;

        setTitle(blog?.title);
        setSelectedTags(blog?.tags || []);
        setCoverImageUrl(blog?.cover_image || "");
        setInitialContent(blog?.content);

        lastSavedDraft.current = {
          html: blog?.content,
          title: blog?.title,
          tags: blog?.tags,
          coverImageUrl: blog?.cover_image || "",
        };
      } catch (err) {
        console.error("Failed to load blog", err);
        toast.error("Failed to load blog for editing");
        navigate(-1);
      }
    };

    fetchBlog();
  }, [blogId, isEditMode]);

  // Cleanup draft and images on page/unload if draft empty
  useEffect(() => {
    const handleCleanup = async () => {
      if (!draftWasReset.current) {
        const draft = loadDraft();
        if (draft && isDraftEmpty(draft.html, draft.title)) {
          localStorage.removeItem(DRAFT_KEY);
          await deleteDraftImages(draft.draftId);
          draftWasReset.current = true;
          // toast.info("Empty draft deleted. Starting a new draft.");
        }
      }
    };

    window.addEventListener("beforeunload", handleCleanup);
    return () => {
      window.removeEventListener("beforeunload", handleCleanup);
    };
  }, [loadDraft]);

  const handleContinueCurrentDraft = () => {
    setShowDraftConflict(false);
    setPendingBlogId(null);

    if (conflictingDraft) {
      loadEditorState(conflictingDraft);
    }
  };

  const handleDiscardAndOpenBlog = async () => {
    try {
      setShowDraftConflict(false);

      if (conflictingDraft?.draftId) {
        await deleteDraftImages(conflictingDraft.draftId);
      }

      localStorage.removeItem(DRAFT_KEY);

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
  };

  const handleSaveDraftToDbAndOpenBlog = async () => {
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
  };

  const handlePreview = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const blog = {
      title,
      content: html,
      tags: selectedTags,
      coverImageUrl,
      read_time: Math.ceil(
        html.replace(/<[^>]*>/g, " ").split(/\s+/).length / 200,
      ),
    };
    navigate("/preview", { state: blog });
  };

  const saveBlog = async (status = "draft") => {
    if (!editor) return;

    const html = editor?.getHTML();
    const extractedTitle = title?.trim();
    if (!extractedTitle || !html.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    const payload = {
      title: extractedTitle,
      content: html,
      tags: selectedTags,
      coverImageUrl,
      read_time: Math.ceil(
        html.replace(/<[^>]*>/g, " ").split(/\s+/).length / 200,
      ),
      is_published: status === "published",
      is_public: true,
      draftId,
    };

    try {
      // const res = await api.post("/blogs/", payload);
      let res;

      if (isEditMode) {
        res = await api.put(`/blogs/${blogId}`, payload);
      } else {
        res = await api.post("/blogs/", payload);
      }

      if (res?.status === 201 || res?.status === 200) {
        // toast.success(
        //   status === "published" ? "Blog published!" : "Draft saved.",
        // );
        toast.success(
          isEditMode
            ? "Blog updated successfully"
            : status === "published"
              ? "Blog published!"
              : "Draft saved.",
        );
        localStorage?.removeItem(DRAFT_KEY);
        isEditMode ? navigate(`/dashboard/posts/${blogId}`) : navigate("/");
      }
    } catch (err) {
      console.error("Save blog error:", err);
      toast.error("Failed to save blog.");
    }
  };

  if (!isDraftLoaded || !editor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading draft...</div>
      </div>
    );
  }

  if (showDraftConflict) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold">You have an unsaved draft</h2>
          <p className="text-sm text-muted-foreground">
            You already have unsaved work in the editor. What would you like to
            do before opening this blog?
          </p>

          <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-1">
            <p>
              <span className="font-medium">Title:</span>{" "}
              {conflictingDraft?.title || "Untitled draft"}
            </p>
            <p>
              <span className="font-medium">Last updated:</span>{" "}
              {conflictingDraft?.lastUpdated
                ? new Date(conflictingDraft.lastUpdated).toLocaleString()
                : "Unknown"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleContinueCurrentDraft}>
              Continue Current Draft
            </Button>
            <Button variant="outline" onClick={handleDiscardAndOpenBlog}>
              Discard Draft and Open Blog
            </Button>
            <Button onClick={handleSaveDraftToDbAndOpenBlog}>
              Save Draft to DB and Open Blog
            </Button>
          </div>
        </div>
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

      <div className="p-4 flex justify-around gap-2 mt-2">
        <Button variant="outline" onClick={() => saveBlog("draft")}>
          Save Draft
        </Button>
        <Button variant="outline" onClick={handlePreview}>
          Preview
        </Button>
        <Button onClick={() => saveBlog("published")}>
          {isEditMode ? "Update Blog" : "Save & Publish"}
        </Button>
      </div>
    </div>
  );
};

export default CreateEditBlog;
