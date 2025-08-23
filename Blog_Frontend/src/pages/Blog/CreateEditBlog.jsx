import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import BlogEditor from "@/components/blogEditor/BlogEditor";
import TagInput from "@/components/blogEditor/TagInput";
import Image from "@tiptap/extension-image";
import ImageWithToolbar from "@/components/blogEditor/ImageWithToolbar";

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
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
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
    ).toString(16)
  );
};

const DRAFT_KEY = "unsavedDraft";

const CreateEditBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [draftId, setDraftId] = useState("");
  const [initialContent, setInitialContent] = useState(
    "<h1></h1><p></p><p></p>"
  );
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Load draft data from localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        return {
          html: parsed.html || "<h1></h1><p></p><p></p>",
          title: parsed.title || "",
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          coverImageUrl: parsed.coverImageUrl || "",
          draftId: parsed.draftId || randomDraftId(),
        };
      }
    } catch (error) {
      console.error("Failed to parse saved draft:", error);
    }
    return null;
  }, []);

  // Save draft data to localStorage
  const saveDraft = useCallback((data) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, []);

  // Load draft on component mount BEFORE editor initialization
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setTitle(draft.title);
      setSelectedTags(draft.tags);
      setCoverImageUrl(draft.coverImageUrl);
      setDraftId(draft.draftId);
      setInitialContent(draft.html);
    } else {
      const newDraftId = randomDraftId();
      setDraftId(newDraftId);
      saveDraft({
        draftId: newDraftId,
        html: "<h1></h1><p></p><p></p>",
        title: "",
        tags: [],
        coverImageUrl: "",
        lastUpdated: new Date().toISOString(),
      });
    }
    setIsDraftLoaded(true);
  }, [loadDraft, saveDraft]);

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
      onUpdate({ editor }) {
        // Auto-save on every change
        const html = editor.getHTML();
        const draftData = {
          html,
          title,
          tags: selectedTags,
          coverImageUrl,
          draftId,
          lastUpdated: new Date().toISOString(),
        };
        saveDraft(draftData);
      },
    },
    [initialContent, isDraftLoaded]
  ); // Re-create editor when content changes

  // Auto-save interval
  useEffect(() => {
    if (!editor || !isDraftLoaded) return;

    const autoSaveInterval = setInterval(() => {
      const html = editor.getHTML();
      const draftData = {
        html,
        title,
        tags: selectedTags,
        coverImageUrl,
        draftId,
        lastUpdated: new Date().toISOString(),
      };
      saveDraft(draftData);
      console.log("Auto-saved draft to localStorage");
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [
    editor,
    isDraftLoaded,
    title,
    selectedTags,
    coverImageUrl,
    draftId,
    saveDraft,
  ]);

  const handlePreview = () => {
    // Build your complete blog object (matching Preview data needs)
    const html = editor.getHTML();
    const blog = {
      title,
      description: html.replace(/<[^>]*>/g, "").substring(0, 150),
      content: html,
      tags: selectedTags,
      coverImageUrl,
      read_time: Math.ceil(editor.getHTML().split(" ").length / 200),
    };

    // Navigate to preview with state
    navigate("/preview", { state: blog });
  };

  const saveBlog = async (status = "draft") => {
    if (!editor) return;

    const html = editor.getHTML();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const contentElements = tempDiv.querySelectorAll("p, h2, h3, ul, ol");
    const extractedTitle = title.trim();
    const content = [...contentElements].map((el) => el.outerHTML).join("");

    if (!extractedTitle || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    const payload = {
      title: extractedTitle,
      content: `<h1>${extractedTitle}</h1>${content}`,
      description: content.replace(/<[^>]*>/g, "").substring(0, 150),
      tags: selectedTags,
      coverImageUrl,
      read_time: Math.ceil(content.split(" ").length / 200),
      is_published: status === "published",
      is_public: true,
      draftId,
    };

    try {
      const res = await api.post("/blogs/", payload);
      if (res?.status === 201) {
        toast.success(
          status === "published" ? "Blog published!" : "Draft saved."
        );

        localStorage.removeItem(DRAFT_KEY);

        if (status === "published") {
          navigate("/");
        }
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

  return (
    <div className="">
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
        <Button onClick={() => saveBlog("published")}>Save & Publish</Button>
      </div>
    </div>
  );
};

export default CreateEditBlog;
