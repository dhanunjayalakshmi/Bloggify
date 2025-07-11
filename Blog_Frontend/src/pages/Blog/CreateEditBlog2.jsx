import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router";
// import api from "@/lib/api";
// import { toast } from "sonner";
import BlogEditor from "@/components/blogEditor/BlogEditor";

const CreateEditBlog = () => {
  // const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Title...";
          return "Tell your story...";
        },
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    autofocus: "start",
    content: "<h1></h1><p></p>", // Blank initial document
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose dark:prose-invert prose-lg max-w-3xl mx-auto py-12 px-4",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      localStorage.setItem("unsavedDraft", html);
    },
  });

  // const saveBlog = async (status = "draft") => {
  //   if (!editor) return;

  //   const html = editor.getHTML();

  //   const tempDiv = document.createElement("div");
  //   tempDiv.innerHTML = html;

  //   const titleElement = tempDiv.querySelector("h1");
  //   const contentElements = tempDiv.querySelectorAll("p, h2, h3, ul, ol");

  //   const title = titleElement?.textContent || "";
  //   const content = [...contentElements].map((el) => el.outerHTML).join("");

  //   if (!title.trim() || !content.trim()) {
  //     toast.error("Title and content are required.");
  //     return;
  //   }

  //   const payload = {
  //     title,
  //     content: `<h1>${title}</h1>${content}`,
  //     description: content.slice(0, 150),
  //     tags: [],
  //     read_time: Math.ceil(content.split(" ").length / 200),
  //     is_published: status === "published",
  //     is_public: true,
  //   };

  //   try {
  //     const res = await api.post("/blogs/", payload);
  //     if (res?.statusText === "Created") {
  //       toast.success(
  //         status === "published" ? "Blog published!" : "Draft saved."
  //       );
  //       localStorage.removeItem("unsavedDraft");
  //     }

  //     if (status === "published") navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to save blog.");
  //   }
  // };

  useEffect(() => {
    const saved = localStorage.getItem("unsavedDraft");
    if (editor && saved) {
      editor.commands.setContent(saved);
    }
  }, [editor]);

  return (
    <>
      <BlogEditor
        title={title}
        setTitle={setTitle}
        content={content}
        onChange={setContent}
      />

      {/* <div className="p-4 flex justify-around gap-2">
        <Button variant="outline" onClick={() => saveBlog("draft")}>
          Save Draft
        </Button>
        <Button variant="outline" onClick={() => navigate("/preview")}>
          Preview
        </Button>
        <Button onClick={() => saveBlog("published")}>Save & Publish</Button>
      </div> */}
    </>
  );
};

export default CreateEditBlog;
