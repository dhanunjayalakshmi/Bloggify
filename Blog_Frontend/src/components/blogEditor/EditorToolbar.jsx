import {
  Bold,
  Code,
  Heading1,
  Heading2,
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

const EditorToolbar = ({ editor }) => {
  return (
    <div className="relative">
      <div className="bg-background/90 dark:bg-gray-800 border rounded shadow-md p-2 flex gap-2">
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

        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
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
    </div>
  );
};

export default EditorToolbar;
