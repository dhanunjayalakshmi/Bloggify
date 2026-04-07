// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import Underline from "@tiptap/extension-underline";
// import Highlight from "@tiptap/extension-highlight";
// import TextAlign from "@tiptap/extension-text-align";
// import Image from "@tiptap/extension-image";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import api from "@/lib/apiClient";
// import BlogEditor from "@/components/blogEditor/BlogEditor";
// import TagInput from "@/components/blogEditor/TagInput";
// import ImageWithToolbar from "@/components/blogEditor/ImageWithToolbar";
// import DraftConflictPrompt from "@/components/blogEditor/DraftConflictPrompt";
// import useBlogEditorDraft, {
//   isEmptyContent,
//   randomDraftId,
// } from "@/hooks/useBlogEditorDraft";
// import { deleteImageByUrl } from "@/services/blogStorage";

// const CustomImage = Image.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),
//       width: {
//         default: "auto",
//         parseHTML: (element) => element.getAttribute("width") || "auto",
//         renderHTML: (attributes) => ({ width: attributes.width }),
//       },
//       align: {
//         default: "center",
//         parseHTML: (element) => element.getAttribute("data-align") || "center",
//         renderHTML: (attributes) => ({
//           "data-align": attributes.align || "center",
//         }),
//       },
//     };
//   },
//   addNodeView() {
//     return ReactNodeViewRenderer(ImageWithToolbar);
//   },
// });

// const extensions = [
//   TextAlign.configure({
//     types: ["heading", "paragraph"],
//   }),
//   Underline,
//   Highlight,
//   StarterKit.configure({
//     heading: { levels: [1, 2, 3] },
//     bulletList: {
//       keepMarks: true,
//       keepAttributes: false,
//     },
//     orderedList: {
//       keepMarks: true,
//       keepAttributes: false,
//     },
//   }),
//   Placeholder.configure({
//     placeholder: ({ node }) =>
//       node.type.name === "heading" ? "Title..." : "Tell your story...",
//     showOnlyWhenEditable: true,
//     showOnlyCurrent: false,
//   }),
//   CustomImage,
// ];

// const CreateEditBlog = () => {
//   const navigate = useNavigate();
//   const { blogId } = useParams();
//   const isEditMode = !!blogId;

//   const { loadDraft, saveDraft, clearDraft, isMeaningfulDraft } =
//     useBlogEditorDraft();

//   const [title, setTitle] = useState("");
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [coverImageUrl, setCoverImageUrl] = useState("");
//   const [draftId, setDraftId] = useState("");
//   const [initialContent, setInitialContent] = useState("<p></p>");
//   const [isDraftLoaded, setIsDraftLoaded] = useState(false);
//   const [dirty, setDirty] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isPublishedBlog, setIsPublishedBlog] = useState(false);
//   const [autosaveStatus, setAutosaveStatus] = useState("idle");

//   const [pendingBlogId, setPendingBlogId] = useState(null);
//   const [showDraftConflict, setShowDraftConflict] = useState(false);
//   const [conflictingDraft, setConflictingDraft] = useState(null);
//   const [draftConflictMode, setDraftConflictMode] = useState("edit");

//   const lastSavedDraft = useRef({
//     html: "",
//     title: "",
//     tags: [],
//     coverImageUrl: "",
//   });

//   const lastKnownImageUrls = useRef(new Set());

//   const extractImageUrlsFromHtml = useCallback((html) => {
//     if (!html) return new Set();

//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;

//     const urls = Array.from(tempDiv.querySelectorAll("img"))
//       .map((img) => img.getAttribute("src"))
//       .filter(Boolean);

//     return new Set(urls);
//   }, []);

//   const loadEditorState = useCallback((data) => {
//     setTitle(data?.title || "");
//     setSelectedTags(data?.tags || []);
//     setCoverImageUrl(data?.coverImageUrl || data?.cover_image || "");
//     setDraftId(data?.draftId || data?.draft_id || randomDraftId());
//     setInitialContent(data?.html || data?.content || "<p></p>");
//     setIsPublishedBlog(Boolean(data?.is_published));

//     const initialHtml = data?.html || data?.content || "<p></p>";

//     lastSavedDraft.current = {
//       html: data?.html || data?.content || "<p></p>",
//       title: data?.title || "",
//       tags: data?.tags || [],
//       coverImageUrl: data?.coverImageUrl || data?.cover_image || "",
//     };
//     lastKnownImageUrls.current = extractImageUrlsFromHtml(initialHtml);
//   }, []);

//   const fetchBlogById = useCallback(async (id) => {
//     const res = await api.get(`/blogs/${id}`);
//     return res?.data;
//   }, []);

//   const onUpdate = ({ editor }) => {
//     const html = editor?.getHTML();

//     const currentImageUrls = extractImageUrlsFromHtml(html);
//     const removedUrls = [...lastKnownImageUrls.current].filter(
//       (url) => !currentImageUrls.has(url),
//     );

//     if (removedUrls.length > 0) {
//       removedUrls.forEach(async (url) => {
//         await deleteImageByUrl(url);
//       });
//     }

//     lastKnownImageUrls.current = currentImageUrls;

//     const hasContentChanged =
//       html !== lastSavedDraft?.current?.html ||
//       title !== lastSavedDraft?.current?.title ||
//       coverImageUrl !== lastSavedDraft?.current?.coverImageUrl ||
//       JSON.stringify(selectedTags) !==
//         JSON.stringify(lastSavedDraft?.current?.tags);

//     if (hasContentChanged) {
//       setDirty(true);
//     }
//   };

//   // Initialize editor AFTER draft is loaded
//   const editor = useEditor(
//     {
//       extensions,
//       autofocus: "start",
//       content: initialContent,
//       editorProps: {
//         attributes: {
//           class:
//             "focus:outline-none prose prose-lg max-w-3xl mx-auto px-2 py-10 prose-slate dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700 dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300 dark:prose-strong:text-slate-100 dark:prose-li:text-slate-300",
//         },
//       },
//       onUpdate,
//     },
//     [initialContent, isDraftLoaded],
//   );

//   const createFreshDraft = useCallback(() => {
//     const newDraftId = randomDraftId();

//     const freshDraft = {
//       draftId: newDraftId,
//       blogId: null,
//       mode: "create",
//       title: "",
//       tags: [],
//       coverImageUrl: "",
//       html: "<p></p>",
//     };

//     loadEditorState(freshDraft);
//     saveDraft(freshDraft);
//     setConflictingDraft(null);
//     setPendingBlogId(null);
//     setShowDraftConflict(false);
//     setDraftConflictMode("create");
//   }, [loadEditorState, saveDraft]);

//   const handleContinueCurrentDraft = () => {
//     setShowDraftConflict(false);
//     setPendingBlogId(null);

//     if (conflictingDraft) {
//       loadEditorState(conflictingDraft);
//     }

//     setConflictingDraft(null);
//   };

//   const handleDiscardAndProceed = useCallback(async () => {
//     try {
//       setShowDraftConflict(false);
//       await clearDraft(true);

//       if (draftConflictMode === "create") {
//         createFreshDraft();
//         return;
//       }

//       if (!pendingBlogId) return;

//       const blog = await fetchBlogById(pendingBlogId);

//       loadEditorState({
//         ...blog,
//         blogId: blog?.id,
//         mode: "edit",
//       });

//       saveDraft({
//         draftId: blog?.draft_id,
//         blogId: blog?.id,
//         mode: "edit",
//         title: blog?.title || "",
//         tags: blog?.tags || [],
//         coverImageUrl: blog?.cover_image || "",
//         html: blog?.content || "<p></p>",
//       });

//       setPendingBlogId(null);
//       setConflictingDraft(null);
//       setShowDraftConflict(false);
//     } catch (err) {
//       console.error("Failed to discard draft and continue:", err);
//       toast.error("Failed to continue");
//     }
//   }, [
//     clearDraft,
//     draftConflictMode,
//     createFreshDraft,
//     pendingBlogId,
//     fetchBlogById,
//     loadEditorState,
//     saveDraft,
//   ]);

//   const handleSaveDraftToDbAndProceed = useCallback(async () => {
//     try {
//       if (!conflictingDraft) return;

//       const extractedTitle = conflictingDraft?.title?.trim();
//       const html = conflictingDraft?.html || "<p></p>";

//       if (!extractedTitle || isEmptyContent(html)) {
//         toast.error(
//           "Current draft is incomplete. Please continue or discard it.",
//         );
//         return;
//       }

//       const payload = {
//         title: extractedTitle,
//         content: html,
//         tags: conflictingDraft?.tags || [],
//         coverImageUrl: conflictingDraft?.coverImageUrl || "",
//         read_time: Math.ceil(
//           html
//             .replace(/<[^>]*>/g, " ")
//             .trim()
//             .split(/\s+/).length / 200,
//         ),
//         is_published: false,
//         is_public: true,
//         draftId: conflictingDraft?.draftId,
//       };

//       if (conflictingDraft?.blogId) {
//         await api.put(`/blogs/${conflictingDraft.blogId}`, payload);
//       } else {
//         await api.post("/blogs", payload);
//       }

//       toast.success("Draft saved successfully");
//       await handleDiscardAndProceed();
//     } catch (err) {
//       console.error("Failed to save conflicting draft:", err);
//       toast.error("Failed to save current draft");
//     }
//   }, [conflictingDraft, handleDiscardAndProceed]);

//   useEffect(() => {
//     const initEditor = async () => {
//       try {
//         const localDraft = loadDraft();

//         // CREATE MODE
//         if (!isEditMode) {
//           if (!localDraft || !isMeaningfulDraft(localDraft)) {
//             if (localDraft && !isMeaningfulDraft(localDraft)) {
//               await clearDraft(true);
//             }

//             createFreshDraft();
//             setIsDraftLoaded(true);
//             return;
//           }

//           // If the existing local draft already belongs to create mode,
//           // just continue it directly instead of showing a conflict prompt.
//           if (!localDraft.blogId && localDraft.mode === "create") {
//             loadEditorState(localDraft);
//             setIsDraftLoaded(true);
//             return;
//           }

//           setConflictingDraft(localDraft);
//           setPendingBlogId(null);
//           setDraftConflictMode("create");
//           setShowDraftConflict(true);
//           setIsDraftLoaded(true);
//           return;
//         }

//         // EDIT MODE
//         if (!localDraft || !isMeaningfulDraft(localDraft)) {
//           if (localDraft && !isMeaningfulDraft(localDraft)) {
//             await clearDraft(true);
//           }

//           const blog = await fetchBlogById(blogId);

//           loadEditorState({
//             ...blog,
//             blogId: blog?.id,
//             mode: "edit",
//           });

//           saveDraft({
//             draftId: blog?.draft_id,
//             blogId: blog?.id,
//             mode: "edit",
//             title: blog?.title || "",
//             tags: blog?.tags || [],
//             coverImageUrl: blog?.cover_image || "",
//             html: blog?.content || "<p></p>",
//           });

//           setIsDraftLoaded(true);
//           return;
//         }

//         // Restore same blog draft directly
//         if (localDraft?.blogId === blogId) {
//           loadEditorState(localDraft);
//           setIsDraftLoaded(true);
//           return;
//         }

//         // Different draft exists, show conflict
//         setConflictingDraft(localDraft);
//         setPendingBlogId(blogId);
//         setDraftConflictMode("edit");
//         setShowDraftConflict(true);
//         setIsDraftLoaded(true);
//       } catch (err) {
//         console.error("Failed to initialize editor:", err);
//         toast.error("Failed to load editor");
//         navigate(-1);
//       }
//     };

//     initEditor();
//   }, [
//     blogId,
//     isEditMode,
//     loadDraft,
//     saveDraft,
//     clearDraft,
//     loadEditorState,
//     fetchBlogById,
//     isMeaningfulDraft,
//     createFreshDraft,
//     navigate,
//   ]);

//   useEffect(() => {
//     if (!editor || !isDraftLoaded) return;

//     const interval = setInterval(() => {
//       const html = editor.getHTML();

//       if (!dirty) return;

//       const draftData = {
//         draftId,
//         blogId: isEditMode ? blogId : null,
//         mode: isEditMode ? "edit" : "create",
//         html,
//         title,
//         tags: selectedTags,
//         coverImageUrl,
//       };

//       setAutosaveStatus("saving");
//       const saved = saveDraft(draftData);
//       setAutosaveStatus(saved ? "saved" : "idle");

//       if (saved) {
//         lastSavedDraft.current = {
//           html: saved.html,
//           title: saved.title,
//           tags: saved.tags,
//           coverImageUrl: saved.coverImageUrl,
//         };
//         setDirty(false);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [
//     editor,
//     isDraftLoaded,
//     dirty,
//     draftId,
//     blogId,
//     isEditMode,
//     title,
//     selectedTags,
//     coverImageUrl,
//     saveDraft,
//   ]);

//   const handlePreview = () => {
//     if (!editor) return;

//     const html = editor.getHTML();

//     const blog = {
//       title,
//       content: html,
//       tags: selectedTags,
//       coverImageUrl,
//       cover_image: coverImageUrl,
//       read_time: Math.ceil(
//         html
//           .replace(/<[^>]*>/g, " ")
//           .trim()
//           .split(/\s+/).length / 200,
//       ),
//     };

//     navigate("/preview", { state: blog });
//   };

//   const saveBlog = async (status = "draft") => {
//     if (!editor || saving) return;

//     const html = editor.getHTML();
//     const extractedTitle = title.trim();

//     if (!extractedTitle || isEmptyContent(html)) {
//       toast.error("Title and content are required.");
//       return;
//     }

//     const payload = {
//       title: extractedTitle,
//       content: html,
//       tags: selectedTags,
//       coverImageUrl,
//       read_time: Math.ceil(
//         html
//           .replace(/<[^>]*>/g, " ")
//           .trim()
//           .split(/\s+/).length / 200,
//       ),
//       is_published: status === "published",
//       is_public: true,
//       draftId,
//     };

//     try {
//       setSaving(true);

//       let res;
//       if (isEditMode) {
//         res = await api.put(`/blogs/${blogId}`, payload);
//       } else {
//         res = await api.post("/blogs", payload);
//       }

//       if (res?.status === 200 || res?.status === 201) {
//         toast.success(
//           isEditMode
//             ? "Blog updated successfully"
//             : status === "published"
//               ? "Blog published!"
//               : "Draft saved.",
//         );

//         await clearDraft(false);
//         isEditMode ? navigate(`/dashboard/posts/${blogId}`) : navigate("/");
//       }
//     } catch (err) {
//       console.error("Save blog error:", err);
//       toast.error("Failed to save blog.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (showDraftConflict) {
//     return (
//       <DraftConflictPrompt
//         draft={conflictingDraft}
//         mode={draftConflictMode}
//         onContinue={handleContinueCurrentDraft}
//         onDiscard={handleDiscardAndProceed}
//         onSaveToDb={handleSaveDraftToDbAndProceed}
//       />
//     );
//   }

//   if (!isDraftLoaded || !editor) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-lg">Loading draft...</div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="px-4 pt-2 mt-4">
//         <div className="mx-auto">
//           <span className="inline-flex items-center rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
//             {isEditMode
//               ? isPublishedBlog
//                 ? "Editing published blog"
//                 : "Editing draft blog"
//               : "New draft"}
//           </span>
//         </div>
//       </div>

//       <BlogEditor
//         editor={editor}
//         title={title}
//         setTitle={setTitle}
//         draftId={draftId}
//         coverImageUrl={coverImageUrl}
//         setCoverImageUrl={setCoverImageUrl}
//       />

//       <TagInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

//       <div className="sticky bottom-3 z-40 mt-6 px-3 md:bottom-4 md:px-4">
//         <div className="mx-auto my-4 flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between md:px-4">
//           <p className="text-xs leading-5 text-slate-500 dark:text-slate-300">
//             {saving
//               ? "Saving blog..."
//               : autosaveStatus === "saving"
//                 ? "Autosaving draft..."
//                 : autosaveStatus === "saved"
//                   ? "Draft saved locally"
//                   : dirty
//                     ? "Unsaved local changes"
//                     : "All changes are local until you save"}
//           </p>

//           <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:flex-wrap md:items-center">
//             <Button variant="outline" onClick={handlePreview} disabled={saving}>
//               Preview
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() => saveBlog("draft")}
//               disabled={saving}
//             >
//               {saving
//                 ? "Saving..."
//                 : isEditMode
//                   ? "Update Draft"
//                   : "Save Draft"}
//             </Button>

//             <Button onClick={() => saveBlog("published")} disabled={saving}>
//               {saving
//                 ? "Saving..."
//                 : isEditMode
//                   ? isPublishedBlog
//                     ? "Update Published Blog"
//                     : "Publish Blog"
//                   : "Save & Publish"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEditBlog;

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
