import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

const FloatingPlusMenu = ({ editor, onPlusClick }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePlus = useCallback(() => {
    if (!editor || !editor.isFocused) {
      setVisible(false);
      return;
    }
    const { state, view } = editor;
    const { from, empty } = state.selection;
    if (!empty) {
      setVisible(false);
      return;
    }

    // Find the parent node for the cursor
    const resolved = state.doc.resolve(from);
    const parent = resolved.parent;
    if (parent.type.name === "paragraph" && parent.content.size === 0) {
      const paraPos = from - resolved.parentOffset; // position of paragraph start
      try {
        const coords = view.coordsAtPos(paraPos);
        setPos({
          top: coords.top + window.scrollY,
          left: coords.left + window.scrollX - 40, // tune this value for margin
        });
        setVisible(true);
        return;
      } catch (e) {
        setVisible(false);
        console.log(e);
        return;
      }
    }
    setVisible(false);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const fn = () => updatePlus();

    editor.on("transaction", fn);
    editor.on("focus", fn);
    editor.on("blur", () => setVisible(false));
    window.addEventListener("scroll", fn, true);
    window.addEventListener("resize", fn);

    updatePlus();

    return () => {
      editor.off("transaction", fn);
      editor.off("focus", fn);
      editor.off("blur", () => setVisible(false));
      window.removeEventListener("scroll", fn, true);
      window.removeEventListener("resize", fn);
    };
  }, [editor, updatePlus]);

  if (!visible) return null;

  return createPortal(
    <button
      type="button"
      style={{
        position: "absolute",
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        zIndex: 10050,
        transition: "opacity 0.12s",
        opacity: 1,
      }}
      className="p-2 rounded-full bg-white dark:bg-gray-900 border shadow hover:bg-gray-100 dark:hover:bg-gray-700"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        if (onPlusClick) onPlusClick();
      }}
      tabIndex={0}
      aria-label="Insert image"
    >
      <Plus size={20} className="text-primary" />
    </button>,
    document.body
  );
};

export default FloatingPlusMenu;
