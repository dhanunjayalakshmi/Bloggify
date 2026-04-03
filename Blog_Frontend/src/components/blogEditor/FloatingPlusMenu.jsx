import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

const FloatingPlusMenu = ({ editor, onPlusClick }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePlus = useCallback(() => {
    if (!editor || editor.isDestroyed || !editor.isFocused) {
      setVisible(false);
      return;
    }

    const view = editor.view;
    const state = editor.state;

    if (!view || view.isDestroyed || !view.dom?.isConnected || !state) {
      setVisible(false);
      return;
    }

    const { from, empty } = state.selection;

    if (!empty) {
      setVisible(false);
      return;
    }

    try {
      const resolved = state.doc.resolve(from);
      const parent = resolved.parent;

      if (parent.type.name !== "paragraph" || parent.content.size !== 0) {
        setVisible(false);
        return;
      }

      const paraPos = from - resolved.parentOffset;
      const coords = view.coordsAtPos(paraPos);

      if (!coords) {
        setVisible(false);
        return;
      }

      setPos({
        top: coords.top + window.scrollY,
        left: coords.left + window.scrollX - 40,
      });

      setVisible(true);
    } catch (err) {
      setVisible(false);
      console.error("FloatingPlusMenu error:", {
        message: err?.message,
        response: err?.response?.data,
      });
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const fn = () => {
      requestAnimationFrame(() => {
        updatePlus();
      });
    };

    const handleBlur = () => setVisible(false);

    editor.on("transaction", fn);
    editor.on("focus", fn);
    editor.on("blur", handleBlur);

    window.addEventListener("scroll", fn, true);
    window.addEventListener("resize", fn);

    fn();

    return () => {
      editor.off("transaction", fn);
      editor.off("focus", fn);
      editor.off("blur", handleBlur);

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
    document.body,
  );
};

export default FloatingPlusMenu;
