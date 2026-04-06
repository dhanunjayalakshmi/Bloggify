import { EditorContent } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import EditorToolbar from "./EditorToolbar";
import CoverImageUpload from "./CoverImageUpload";
import FloatingPlusMenu from "./FloatingPlusMenu";
import { useEditorImageUpload } from "@/hooks/useEditorImageUpload";

const BlogEditor = ({
  editor,
  title,
  setTitle,
  draftId,
  coverImageUrl,
  setCoverImageUrl,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const { handleImageUpload } = useEditorImageUpload(editor, draftId);
  const editorRef = useRef(null);

  const showToolbarAtSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
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

    const toolbarWidth = 720;
    const viewportPadding = 16;
    const viewportWidth = window.innerWidth;

    const centeredLeft =
      rect.left + window.scrollX + rect.width / 2 - toolbarWidth / 2;

    const safeLeft = Math.max(
      viewportPadding + window.scrollX,
      Math.min(
        centeredLeft,
        window.scrollX + viewportWidth - toolbarWidth - viewportPadding,
      ),
    );

    setToolbarPosition({
      top: rect.top + window.scrollY - 60,
      left: safeLeft,
    });

    setShowToolbar(true);
  };

  const handleInsertImage = async () => {
    if (!editor || !draftId) return;
    await handleImageUpload({ insertToEditor: true });
  };

  useEffect(() => {
    if (!editor) return;

    const handleMouseUp = () => {
      setTimeout(showToolbarAtSelection, 50);
    };

    const handleSelectionChange = () => {
      setTimeout(showToolbarAtSelection, 50);
    };

    const handleClick = (e) => {
      if (!e.target.closest(".tiptap-toolbar")) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("click", handleClick);
    };
  }, [editor]);

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {editor && showToolbar && (
        <div
          className="tiptap-toolbar absolute z-50 transition-all"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            maxWidth: "calc(100vw - 32px)",
            width: "min(720px, calc(100vw - 32px))",
          }}
        >
          <EditorToolbar editor={editor} />
        </div>
      )}

      <div ref={editorRef} className="w-full mx-auto px-5 md:px-8 pb-16 pt-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="w-full bg-transparent border-none outline-none px-1 mb-6 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <CoverImageUpload
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
          draftId={draftId}
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
