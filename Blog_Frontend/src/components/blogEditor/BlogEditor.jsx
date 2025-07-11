import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import EditorToolbar from "./EditorToolbar";

const BlogEditor = ({ content = "", onChange, title, setTitle }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({
        placeholder: "Write something...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
        emptyEditorClass: "is-editor-empty",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Highlight,
      Image,
    ],
    content: content?.trim() || "<p></p>",
    autofocus: "start",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-3xl mx-auto px-4 focus:outline-none",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          const { $from } = view.state.selection;

          // Prevent multiple empty paragraphs before typing
          if (
            event.key === "Enter" &&
            $from.parent.type.name === "paragraph" &&
            $from.parent.textContent.trim() === "" &&
            $from.pos > 5
          ) {
            return true;
          }
        },
      },
    },
  });

  // 🧠 Handle Selection & Double Click for Toolbar
  useEffect(() => {
    if (!editor) return;

    const showToolbarAtSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (!text) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Show toolbar near selection
      setToolbarPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX,
      });

      setShowToolbar(true);
    };

    const handleDoubleClick = (e) => {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (!range) return;

      const rect = range.getBoundingClientRect();
      const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
      const node = pos ? editor.view.state.doc.nodeAt(pos.pos) : null;

      if (node && node.textContent?.trim().length > 0) {
        setToolbarPosition({
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX,
        });
        setShowToolbar(true);
      }
    };

    const handleMouseUp = () => {
      // Add slight delay to let selection settle
      setTimeout(() => {
        showToolbarAtSelection();
      }, 50);
    };

    const handleClick = (e) => {
      // Don’t hide if clicked inside toolbar
      if (!e.target.closest(".tiptap-toolbar")) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("dblclick", handleDoubleClick);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("dblclick", handleDoubleClick);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
    };
  }, [editor]);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-[calc(100vh-13em)] my-6 pt-6">
      {/* 🎯 Floating Toolbar */}
      {editor && showToolbar && (
        <div
          className="tiptap-toolbar absolute z-50 bg-background dark:bg-gray-800 rounded shadow-md transition-all"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <EditorToolbar editor={editor} />
        </div>
      )}

      <div ref={editorRef} className="w-full mx-auto px-4 pb-16 relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="w-full text-4xl px-2 font-bold bg-transparent border-none outline-none mb-4 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default BlogEditor;
