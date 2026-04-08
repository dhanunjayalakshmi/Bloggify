import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

import BlogEditor from "@/components/blogEditor/BlogEditor";
import TagInput from "@/components/blogEditor/TagInput";
import ImageWithToolbar from "@/components/blogEditor/ImageWithToolbar";
import DraftConflictPrompt from "@/components/blogEditor/DraftConflictPrompt";
import EditorModeBadge from "@/components/blogEditor/EditorModeBadge";
import EditorActionBar from "@/components/blogEditor/EditorActionBar";
import useBlogEditorController from "@/hooks/useBlogEditorController";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => {
          const dataWidth = element.getAttribute("data-width");
          const attrWidth = element.getAttribute("width");
          const styleWidth = element.style?.width;

          if (dataWidth && dataWidth !== "auto") return dataWidth;
          if (attrWidth) return attrWidth;

          if (styleWidth) {
            const numericWidth = styleWidth.replace("px", "").trim();
            return numericWidth || "auto";
          }

          return "auto";
        },
        renderHTML: (attributes) => {
          const width = attributes.width || "auto";

          if (width === "auto") {
            return {
              "data-width": "auto",
            };
          }

          return {
            "data-width": width,
            width,
            style: `width: ${width}px;`,
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "center",
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageWithToolbar);
  },
});

const extensions = [
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  Highlight,
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) =>
      node.type.name === "heading" ? "Title..." : "Tell your story...",
    showOnlyWhenEditable: true,
    showOnlyCurrent: false,
  }),
  CustomImage,
];

const CreateEditBlog = () => {
  const {
    isEditMode,
    title,
    setTitle,
    selectedTags,
    setSelectedTags,
    coverImageUrl,
    setCoverImageUrl,
    draftId,
    initialContent,
    isDraftLoaded,
    saving,
    dirty,
    autosaveStatus,
    isPublishedBlog,
    showDraftConflict,
    conflictingDraft,
    draftConflictMode,
    onEditorUpdate,
    runAutosave,
    handlePreview,
    saveBlog,
    handleContinueCurrentDraft,
    handleDiscardAndProceed,
    handleSaveDraftToDbAndProceed,
  } = useBlogEditorController();

  const editor = useEditor(
    {
      extensions,
      autofocus: false,
      content: initialContent,
      editorProps: {
        attributes: {
          class:
            "focus:outline-none prose prose-lg max-w-3xl mx-auto px-2 py-10 prose-slate dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700 dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300 dark:prose-strong:text-slate-100 dark:prose-li:text-slate-300",
        },
      },
      onUpdate: onEditorUpdate,
    },
    [initialContent, isDraftLoaded],
  );

  useEffect(() => {
    if (!editor || !isDraftLoaded) return;

    const interval = setInterval(() => {
      runAutosave(editor);
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, isDraftLoaded, runAutosave]);

  if (showDraftConflict) {
    return (
      <DraftConflictPrompt
        draft={conflictingDraft}
        mode={draftConflictMode}
        onContinue={handleContinueCurrentDraft}
        onDiscard={handleDiscardAndProceed}
        onSaveToDb={handleSaveDraftToDbAndProceed}
      />
    );
  }

  if (!isDraftLoaded || !editor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading draft...</div>
      </div>
    );
  }

  return (
    <div>
      <EditorModeBadge
        isEditMode={isEditMode}
        isPublishedBlog={isPublishedBlog}
      />

      <BlogEditor
        editor={editor}
        title={title}
        setTitle={setTitle}
        draftId={draftId}
        coverImageUrl={coverImageUrl}
        setCoverImageUrl={setCoverImageUrl}
      />

      <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      <EditorActionBar
        saving={saving}
        autosaveStatus={autosaveStatus}
        dirty={dirty}
        isEditMode={isEditMode}
        isPublishedBlog={isPublishedBlog}
        onPreview={() => handlePreview(editor)}
        onSaveDraft={() => saveBlog(editor, "draft")}
        onPublish={() => saveBlog(editor, "published")}
      />
    </div>
  );
};

export default CreateEditBlog;
