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

const getButtonClass = (isActive) =>
  `shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700 ${
    isActive
      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300"
      : ""
  }`;

const EditorToolbar = ({ editor }) => {
  return (
    <div className="relative w-full">
      <div className="w-full overflow-x-auto rounded-md border bg-background/95 dark:bg-gray-800 shadow-md">
        <div className="min-w-max p-2 flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("highlight"))}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("heading", { level: 1 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("heading", { level: 2 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("blockquote"))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("left"))}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("center"))}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("right"))}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={getButtonClass(editor.isActive("justify"))}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo size={18} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
