import { EditorContent } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import EditorToolbar from "./EditorToolbar";
import CoverImageUpload from "./CoverImageUpload";
import { useEditorImageUpload } from "@/hooks/useEditorImageUpload";
import FloatingPlusMenu from "./FloatingPlusMenu";

const BlogEditor = ({
  editor,
  title,
  setTitle,
  coverImageUrl,
  setCoverImageUrl,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const { handleImageUpload } = useEditorImageUpload(editor);

  const editorRef = useRef(null);

  const showToolbarAtSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowToolbar(false);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setToolbarPosition({
      top: rect.top + window.scrollY - 50,
      left: rect.left + window.scrollX,
    });

    setShowToolbar(true);
  };

  const handleInsertImage = async () => {
    if (!editor) return;
    console.log("handleInsertImage called");
    await handleImageUpload({ insertToEditor: true });
  };

  useEffect(() => {
    if (!editor) return;

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
      setTimeout(() => {
        showToolbarAtSelection();
      }, 50);
    };

    const handleSelectionChange = () => {
      setTimeout(() => {
        showToolbarAtSelection();
      }, 50);
    };

    const handleClick = (e) => {
      if (!e.target.closest(".tiptap-toolbar")) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("dblclick", handleDoubleClick);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("dblclick", handleDoubleClick);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("click", handleClick);
    };
  }, [editor]);

  return (
    <div className="bg-white dark:bg-gray-800 mt-6 pt-6 rounded-lg">
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

      <div ref={editorRef} className="w-full mx-auto px-4 pb-16">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="w-full text-4xl px-2 font-bold bg-transparent border-none outline-none mb-4 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <CoverImageUpload
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
          editor={editor}
        />
        {editor && (
          <FloatingPlusMenu editor={editor} onPlusClick={handleInsertImage} />
        )}

        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default BlogEditor;
