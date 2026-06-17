import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/apiClient";
import useBlogEditorDraft, {
  isEmptyContent,
  randomDraftId,
} from "@/hooks/useBlogEditorDraft";
import { deleteImageByUrl } from "@/services/blogStorage";

const useBlogEditorController = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const isEditMode = !!blogId;

  const { loadDraft, saveDraft, clearDraft, isMeaningfulDraft } =
    useBlogEditorDraft();

  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [draftId, setDraftId] = useState("");
  const [initialContent, setInitialContent] = useState("<p></p>");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPublishedBlog, setIsPublishedBlog] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState("idle");

  const [pendingBlogId, setPendingBlogId] = useState(null);
  const [showDraftConflict, setShowDraftConflict] = useState(false);
  const [conflictingDraft, setConflictingDraft] = useState(null);
  const [draftConflictMode, setDraftConflictMode] = useState("edit");

  const lastSavedDraft = useRef({
    html: "",
    title: "",
    tags: [],
    coverImageUrl: "",
  });

  const lastKnownImageUrls = useRef(new Set());

  const extractImageUrlsFromHtml = useCallback((html) => {
    if (!html) return new Set();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const urls = Array.from(tempDiv.querySelectorAll("img"))
      .map((img) => img.getAttribute("src"))
      .filter(Boolean);

    return new Set(urls);
  }, []);

  const loadEditorState = useCallback(
    (data) => {
      setTitle(data?.title || "");
      setSelectedTags(data?.tags || []);
      setCoverImageUrl(data?.coverImageUrl || data?.cover_image || "");
      setDraftId(data?.draftId || data?.draft_id || randomDraftId());
      setInitialContent(data?.html || data?.content || "<p></p>");
      setIsPublishedBlog(Boolean(data?.is_published));
      setScheduledAt(data?.scheduled_at || null);

      const initialHtml = data?.html || data?.content || "<p></p>";

      lastSavedDraft.current = {
        html: initialHtml,
        title: data?.title || "",
        tags: data?.tags || [],
        coverImageUrl: data?.coverImageUrl || data?.cover_image || "",
      };

      lastKnownImageUrls.current = extractImageUrlsFromHtml(initialHtml);
    },
    [extractImageUrlsFromHtml],
  );

  const fetchBlogById = useCallback(async (id) => {
    const res = await api.get(`/blogs/${id}`);
    return res?.data;
  }, []);

  const onEditorUpdate = useCallback(
    ({ editor }) => {
      const html = editor?.getHTML();

      const currentImageUrls = extractImageUrlsFromHtml(html);
      const removedUrls = [...lastKnownImageUrls.current].filter(
        (url) => !currentImageUrls.has(url),
      );

      if (removedUrls.length > 0) {
        removedUrls.forEach(async (url) => {
          await deleteImageByUrl(url);
        });
      }

      lastKnownImageUrls.current = currentImageUrls;

      const hasContentChanged =
        html !== lastSavedDraft?.current?.html ||
        title !== lastSavedDraft?.current?.title ||
        coverImageUrl !== lastSavedDraft?.current?.coverImageUrl ||
        JSON.stringify(selectedTags) !==
          JSON.stringify(lastSavedDraft?.current?.tags);

      if (hasContentChanged) {
        setDirty(true);
      }
    },
    [extractImageUrlsFromHtml, title, coverImageUrl, selectedTags],
  );

  const createFreshDraft = useCallback(() => {
    const newDraftId = randomDraftId();

    const freshDraft = {
      draftId: newDraftId,
      blogId: null,
      mode: "create",
      title: "",
      tags: [],
      coverImageUrl: "",
      html: "<p></p>",
    };

    loadEditorState(freshDraft);
    saveDraft(freshDraft);
    setConflictingDraft(null);
    setPendingBlogId(null);
    setShowDraftConflict(false);
    setDraftConflictMode("create");
  }, [loadEditorState, saveDraft]);

  const handleContinueCurrentDraft = useCallback(() => {
    setShowDraftConflict(false);
    setPendingBlogId(null);

    if (conflictingDraft) {
      loadEditorState(conflictingDraft);
    }

    setConflictingDraft(null);
  }, [conflictingDraft, loadEditorState]);

  const handleDiscardAndProceed = useCallback(async () => {
    try {
      setShowDraftConflict(false);
      await clearDraft(true);

      if (draftConflictMode === "create") {
        createFreshDraft();
        return;
      }

      if (!pendingBlogId) return;

      const blog = await fetchBlogById(pendingBlogId);

      loadEditorState({
        ...blog,
        blogId: blog?.id,
        mode: "edit",
      });

      saveDraft({
        draftId: blog?.draft_id,
        blogId: blog?.id,
        mode: "edit",
        title: blog?.title || "",
        tags: blog?.tags || [],
        coverImageUrl: blog?.cover_image || "",
        html: blog?.content || "<p></p>",
      });

      setPendingBlogId(null);
      setConflictingDraft(null);
      setShowDraftConflict(false);
    } catch (err) {
      console.error("Failed to discard draft and continue:", err);
      toast.error("Failed to continue");
    }
  }, [
    clearDraft,
    createFreshDraft,
    draftConflictMode,
    fetchBlogById,
    loadEditorState,
    pendingBlogId,
    saveDraft,
  ]);

  const handleSaveDraftToDbAndProceed = useCallback(async () => {
    try {
      if (!conflictingDraft) return;

      const extractedTitle = conflictingDraft?.title?.trim();
      const html = conflictingDraft?.html || "<p></p>";

      if (!extractedTitle || isEmptyContent(html)) {
        toast.error(
          "Current draft is incomplete. Please continue or discard it.",
        );
        return;
      }

      const payload = {
        title: extractedTitle,
        content: html,
        tags: conflictingDraft?.tags || [],
        coverImageUrl: conflictingDraft?.coverImageUrl || "",
        read_time: Math.ceil(
          html
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/).length / 200,
        ),
        is_published: false,
        is_public: true,
        draftId: conflictingDraft?.draftId,
      };

      if (conflictingDraft?.blogId) {
        await api.put(`/blogs/${conflictingDraft.blogId}`, payload);
      } else {
        await api.post("/blogs", payload);
      }

      toast.success("Draft saved successfully");
      await handleDiscardAndProceed();
    } catch (err) {
      console.error("Failed to save conflicting draft:", err);
      toast.error("Failed to save current draft");
    }
  }, [conflictingDraft, handleDiscardAndProceed]);

  useEffect(() => {
    const initEditor = async () => {
      try {
        const localDraft = loadDraft();

        if (!isEditMode) {
          if (!localDraft || !isMeaningfulDraft(localDraft)) {
            if (localDraft && !isMeaningfulDraft(localDraft)) {
              await clearDraft(true);
            }

            createFreshDraft();
            setIsDraftLoaded(true);
            return;
          }

          if (!localDraft.blogId && localDraft.mode === "create") {
            loadEditorState(localDraft);
            setIsDraftLoaded(true);
            return;
          }

          setConflictingDraft(localDraft);
          setPendingBlogId(null);
          setDraftConflictMode("create");
          setShowDraftConflict(true);
          setIsDraftLoaded(true);
          return;
        }

        if (!localDraft || !isMeaningfulDraft(localDraft)) {
          if (localDraft && !isMeaningfulDraft(localDraft)) {
            await clearDraft(true);
          }

          const blog = await fetchBlogById(blogId);

          loadEditorState({
            ...blog,
            blogId: blog?.id,
            mode: "edit",
          });

          saveDraft({
            draftId: blog?.draft_id,
            blogId: blog?.id,
            mode: "edit",
            title: blog?.title || "",
            tags: blog?.tags || [],
            coverImageUrl: blog?.cover_image || "",
            html: blog?.content || "<p></p>",
          });

          setIsDraftLoaded(true);
          return;
        }

        if (localDraft?.blogId === blogId) {
          loadEditorState(localDraft);
          setIsDraftLoaded(true);
          return;
        }

        setConflictingDraft(localDraft);
        setPendingBlogId(blogId);
        setDraftConflictMode("edit");
        setShowDraftConflict(true);
        setIsDraftLoaded(true);
      } catch (err) {
        console.error("Failed to initialize editor:", err);
        toast.error("Failed to load editor");
        navigate(-1);
      }
    };

    initEditor();
  }, [
    blogId,
    clearDraft,
    createFreshDraft,
    fetchBlogById,
    isEditMode,
    isMeaningfulDraft,
    loadDraft,
    loadEditorState,
    navigate,
    saveDraft,
  ]);

  const handlePreview = useCallback(
    (editor) => {
      if (!editor) return;

      const html = editor.getHTML();

      // Persist latest editor state before opening preview
      const draftData = {
        draftId,
        blogId: isEditMode ? blogId : null,
        mode: isEditMode ? "edit" : "create",
        html,
        title,
        tags: selectedTags,
        coverImageUrl,
      };

      const saved = saveDraft(draftData);

      if (saved) {
        lastSavedDraft.current = {
          html: saved.html,
          title: saved.title,
          tags: saved.tags,
          coverImageUrl: saved.coverImageUrl,
        };
        lastKnownImageUrls.current = extractImageUrlsFromHtml(saved.html);
        setDirty(false);
        setAutosaveStatus("saved");
      }

      const blog = {
        title,
        content: html,
        tags: selectedTags,
        coverImageUrl,
        cover_image: coverImageUrl,
        read_time: Math.ceil(
          html
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/).length / 200,
        ),
      };

      navigate("/preview", { state: blog });
    },
    [
      blogId,
      coverImageUrl,
      draftId,
      extractImageUrlsFromHtml,
      isEditMode,
      navigate,
      saveDraft,
      selectedTags,
      title,
    ],
  );

  const saveBlog = useCallback(
    async (editor, status = "draft") => {
      if (!editor || saving) return;

      const html = editor.getHTML();
      const extractedTitle = title.trim();

      if (!extractedTitle || isEmptyContent(html)) {
        toast.error("Title and content are required.");
        return;
      }

      const payload = {
        title: extractedTitle,
        content: html,
        tags: selectedTags,
        coverImageUrl,
        read_time: Math.ceil(
          html
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/).length / 200,
        ),
        is_published: status === "published",
        is_public: true,
        draftId,
      };

      try {
        setSaving(true);

        let res;
        if (isEditMode) {
          res = await api.put(`/blogs/${blogId}`, payload);
        } else {
          res = await api.post("/blogs", payload);
        }

        if (res?.status === 200 || res?.status === 201) {
          toast.success(
            isEditMode
              ? "Blog updated successfully"
              : status === "published"
                ? "Blog published!"
                : "Draft saved.",
          );

          await clearDraft(false);
          isEditMode ? navigate(`/dashboard/posts/${blogId}`) : navigate("/");
        }
      } catch (err) {
        console.error("Save blog error:", err);
        toast.error("Failed to save blog.");
      } finally {
        setSaving(false);
      }
    },
    [
      blogId,
      clearDraft,
      coverImageUrl,
      draftId,
      isEditMode,
      navigate,
      saving,
      selectedTags,
      title,
    ],
  );

  const saveScheduled = useCallback(
    async (editor, scheduledDate) => {
      if (!editor || saving) return;

      const html = editor.getHTML();
      const extractedTitle = title.trim();

      if (!extractedTitle || isEmptyContent(html)) {
        toast.error("Title and content are required to schedule.");
        return;
      }

      const payload = {
        title: extractedTitle,
        content: html,
        tags: selectedTags,
        coverImageUrl,
        read_time: Math.ceil(
          html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length / 200,
        ),
        is_published: false,
        is_public: true,
        draftId,
        scheduled_at: scheduledDate,
      };

      try {
        setSaving(true);
        let res;
        if (isEditMode) {
          res = await api.put(`/blogs/${blogId}`, payload);
        } else {
          res = await api.post("/blogs", payload);
        }

        if (res?.status === 200 || res?.status === 201) {
          setScheduledAt(scheduledDate);
          toast.success(`Post scheduled for ${new Date(scheduledDate).toLocaleString()}`);
          await clearDraft(false);
          navigate("/profile/posts");
        }
      } catch (err) {
        console.error("Schedule blog error:", err);
        toast.error("Failed to schedule blog.");
      } finally {
        setSaving(false);
      }
    },
    [blogId, clearDraft, coverImageUrl, draftId, isEditMode, navigate, saving, selectedTags, title],
  );

  const runAutosave = useCallback(
    (editor) => {
      if (!editor || !dirty) return;

      const html = editor.getHTML();

      const draftData = {
        draftId,
        blogId: isEditMode ? blogId : null,
        mode: isEditMode ? "edit" : "create",
        html,
        title,
        tags: selectedTags,
        coverImageUrl,
      };

      setAutosaveStatus("saving");
      const saved = saveDraft(draftData);
      setAutosaveStatus(saved ? "saved" : "idle");

      if (saved) {
        lastSavedDraft.current = {
          html: saved.html,
          title: saved.title,
          tags: saved.tags,
          coverImageUrl: saved.coverImageUrl,
        };
        setDirty(false);
      }
    },
    [
      blogId,
      coverImageUrl,
      dirty,
      draftId,
      isEditMode,
      saveDraft,
      selectedTags,
      title,
    ],
  );

  return {
    blogId,
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
    scheduledAt,
    showDraftConflict,
    conflictingDraft,
    draftConflictMode,
    onEditorUpdate,
    runAutosave,
    handlePreview,
    saveBlog,
    saveScheduled,
    handleContinueCurrentDraft,
    handleDiscardAndProceed,
    handleSaveDraftToDbAndProceed,
  };
};

export default useBlogEditorController;
