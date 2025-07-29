import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import BlogEditor from "@/components/blogEditor/BlogEditor";
import TagInput from "@/components/blogEditor/TagInput";
import Image from "@tiptap/extension-image";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || "auto",
        renderHTML: (attributes) => {
          return { width: attributes.width };
        },
      },
      align: {
        default: "center",
        parseHTML: () => "center",
        renderHTML: () => {
          return {
            "data-align": "center",
            class: "align-center",
          };
        },
      },
    };
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

const CreateEditBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const editor = useEditor({
    extensions,
    autofocus: "start",
    content: "<h1></h1><p></p>",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose dark:prose-invert prose-lg max-w-3xl mx-auto py-12 px-4",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const draftData = {
        html,
        title,
        tags: selectedTags,
        coverImageUrl,
      };
      localStorage.setItem("unsavedDraft", JSON.stringify(draftData));
    },
  });

  const saveBlog = async (status = "draft") => {
    if (!editor) return;

    const html = editor.getHTML();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // const titleElement = tempDiv.querySelector("h1");
    const contentElements = tempDiv.querySelectorAll("p, h2, h3, ul, ol");

    // const extractedTitle = titleElement?.textContent || "";
    const extractedTitle = title.trim();
    const content = [...contentElements].map((el) => el.outerHTML).join("");

    if (!extractedTitle.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    const payload = {
      title: extractedTitle,
      content: `<h1>${extractedTitle}</h1>${content}`,
      description: content.slice(0, 150),
      tags: selectedTags,
      coverImageUrl: coverImageUrl,
      read_time: Math.ceil(content.split(" ").length / 200),
      is_published: status === "published",
      is_public: true,
    };

    try {
      const res = await api.post("/blogs/", payload);
      if (res?.statusText === "Created") {
        toast.success(
          status === "published" ? "Blog published!" : "Draft saved."
        );
        localStorage.removeItem("unsavedDraft");
      }

      if (status === "published") navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog.");
    }
  };

  useEffect(() => {
    if (!editor) return;

    const autoSaveInterval = setInterval(() => {
      const html = editor.getHTML();
      const draftData = {
        html,
        title,
        tags: selectedTags,
        coverImageUrl,
      };
      localStorage.setItem("unsavedDraft", JSON.stringify(draftData));
      console.log("Auto-saved draft to localStorage");
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [editor]);

  useEffect(() => {
    const saved = localStorage.getItem("unsavedDraft");
    if (editor && saved) {
      const { html, title, tags, coverImageUrl } = JSON.parse(saved);
      editor.commands.setContent(html);
      setTitle(title || "");
      setSelectedTags(tags || []);
      setCoverImageUrl(coverImageUrl || "");
    }
  }, [editor]);

  return (
    <div className="">
      <BlogEditor
        editor={editor}
        title={title}
        setTitle={setTitle}
        coverImageUrl={coverImageUrl}
        setCoverImageUrl={setCoverImageUrl}
      />

      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      <div className="p-4 flex justify-around gap-2">
        <Button variant="outline" onClick={() => saveBlog("draft")}>
          Save Draft
        </Button>
        <Button variant="outline" onClick={() => navigate("/preview")}>
          Preview
        </Button>
        <Button onClick={() => saveBlog("published")}>Save & Publish</Button>
      </div>
    </div>
  );
};

export default CreateEditBlog;
