import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import EditorToolbar from "./EditorToolbar";
import { Label } from "../ui/label";

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
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  CustomImage,
  Underline,
  Highlight,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const ContentEditor = ({ content, onChange }) => {
  const initialContent =
    !content || content.includes("<ul></ul>")
      ? "<p>Start writing your blog...</p>"
      : content;

  const editor = useEditor({
    extensions,
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [editor]);

  return (
    <div className="space-y-2">
      <Label htmlFor="content" className="text-base font-medium">
        Content
      </Label>

      <div className="border rounded-md shadow-sm bg-background dark:bg-gray-800">
        {!editor ? (
          <div className="p-4 text-muted-foreground text-sm italic">
            Loading editor...
          </div>
        ) : (
          <>
            <EditorToolbar editor={editor} />
            <div
              className="p-4 min-h-[300px] tiptap prose dark:prose-invert max-w-none"
              style={{
                lineHeight: "1.4",
                wordBreak: "break-word",
              }}
            >
              <EditorContent editor={editor} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
