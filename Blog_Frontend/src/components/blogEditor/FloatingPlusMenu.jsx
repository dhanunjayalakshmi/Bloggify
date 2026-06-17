import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Type,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Image,
} from "lucide-react";

const BLOCK_ITEMS = [
  {
    label: "Text",
    desc: "Plain paragraph",
    icon: Type,
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: "Heading 1",
    desc: "Large section heading",
    icon: Heading1,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    desc: "Medium section heading",
    icon: Heading2,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Bullet List",
    desc: "Unordered list",
    icon: List,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered List",
    desc: "Ordered list",
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Code Block",
    desc: "Code with syntax highlighting",
    icon: Code,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    label: "Quote",
    desc: "Blockquote",
    icon: Quote,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Divider",
    desc: "Horizontal rule",
    icon: Minus,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    label: "Image",
    desc: "Upload an image",
    icon: Image,
    action: null, // handled via onPlusClick
  },
];

const FloatingPlusMenu = ({ editor, onPlusClick }) => {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef(null);

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

      // Center button vertically with the text line; pull it left so there's a clear gap
      const lineCenter = (coords.top + coords.bottom) / 2;
      setPos({
        top: lineCenter + window.scrollY - 18,
        left: coords.left + window.scrollX - 56,
      });

      setVisible(true);
    } catch (err) {
      setVisible(false);
    }
  }, [editor]);

  // Close menu when cursor moves off the empty line
  useEffect(() => {
    if (!visible) setMenuOpen(false);
  }, [visible]);

  useEffect(() => {
    if (!editor) return;

    const fn = () => requestAnimationFrame(updatePlus);
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

  // Keyboard navigation inside the menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        editor?.commands.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % BLOCK_ITEMS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + BLOCK_ITEMS.length) % BLOCK_ITEMS.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(BLOCK_ITEMS[activeIndex]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen, activeIndex, editor]);

  const handleSelect = (item) => {
    setMenuOpen(false);
    if (!item.action) {
      onPlusClick?.();
    } else {
      item.action(editor);
    }
  };

  if (!visible) return null;

  // Position menu at the same level as the + button, with a gap to the right
  const menuTop = pos.top;
  const menuLeft = pos.left + 44;

  return createPortal(
    <>
      {/* + button */}
      <button
        type="button"
        title="Insert block"
        aria-label="Insert block"
        style={{
          position: "absolute",
          top: `${pos.top}px`,
          left: `${pos.left}px`,
          zIndex: 10050,
        }}
        className="p-2 rounded-full bg-white dark:bg-gray-900 border shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform hover:scale-110"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          setActiveIndex(0);
          setMenuOpen((prev) => !prev);
        }}
      >
        <Plus
          size={20}
          className={`text-primary transition-transform duration-150 ${menuOpen ? "rotate-45" : ""}`}
        />
      </button>

      {/* Block picker dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: `${menuTop}px`,
            left: `${menuLeft}px`,
            zIndex: 10051,
          }}
          className="w-60 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-xl py-1 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <p className="text-xs text-muted-foreground px-3 pt-2 pb-1 font-medium uppercase tracking-wide">
            Insert block
          </p>
          {BLOCK_ITEMS.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                idx === activeIndex
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 shrink-0">
                <item.icon size={15} className="text-gray-600 dark:text-gray-300" />
              </span>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100 leading-tight">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </>,
    document.body
  );
};

export default FloatingPlusMenu;
