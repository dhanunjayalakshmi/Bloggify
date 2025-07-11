import {
  Bold,
  Code,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
} from "lucide-react";

import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";

const EditorToolbar = ({ editor }) => {
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  const [imageCoords, setImageCoords] = useState({ top: 0, left: 0 });
  const [uploading, setUploading] = useState(false);
  const toolbarRef = useRef();

  const uploadImage = async (file) => {
    setUploading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
        setUploading(false);
      }, 1000);
    });
  };

  useEffect(() => {
    if (!editor) return;

    const { state, view } = editor;
    const { selection } = state;
    const node = selection?.node;

    if (node?.type?.name === "image") {
      const start = selection.from;
      const coords = view.coordsAtPos(start);
      const editorContainer = view.dom.getBoundingClientRect();

      setImageCoords({
        top: coords.top - editorContainer.top + 40,
        left: coords.left - editorContainer.left + 15,
      });

      setShowImageToolbar(true);
    } else {
      setShowImageToolbar(false);
    }
  }, [editor?.state]);

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const imageUrl = await uploadImage(file);

      if (imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    };

    input.click();
  };

  return (
    <div className="relative">
      <div className="bg-background/90 dark:bg-gray-800 border rounded shadow-md p-2 flex gap-2">
        {/* <div className="flex flex-wrap gap-2 px-4 py-2 bg-muted dark:bg-gray-900"> */}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter size={18} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={18} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={18} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </Button>

        {/* Horizontal rule */}
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
        </Button>

        <Button
          disabled={uploading}
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={handleImageUpload}
        >
          <ImageIcon size={18} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={18} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={18} />
        </Button>
      </div>

      {showImageToolbar && (
        <div
          ref={toolbarRef}
          className="absolute z-50 p-2 border bg-white rounded shadow-md flex gap-2 animate-fade-in dark:bg-gray-800"
          style={{
            top: `${imageCoords.top}px`,
            left: `${imageCoords.left}px`,
          }}
        >
          {["150", "300", "400", "600", "auto"].map((size) => (
            <Button
              variant="ghostButton"
              key={size}
              className="px-2 py-1 text-sm border bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { width: size })
                  .run();
                setShowImageToolbar(false);
              }}
            >
              {size === "auto" ? "Original" : `${size}px`}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
