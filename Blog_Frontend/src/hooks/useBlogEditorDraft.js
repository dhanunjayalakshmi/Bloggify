import { useCallback } from "react";
import { deleteDraftImages } from "@/services/blogStorage";

export const DRAFT_KEY = "blog-editor-draft";

export const isEmptyContent = (html) => {
  if (!html || html === "<p></p>" || html.trim() === "") return true;
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
};

export const hasImagesInContent = (html) => {
  if (!html) return false;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.querySelectorAll("img").length > 0;
};

export const isDraftEmpty = (html, title, coverImageUrl) => {
  return (
    isEmptyContent(html) &&
    !title.trim() &&
    !hasImagesInContent(html) &&
    !coverImageUrl
  );
};

export const randomDraftId = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1)) & (15 >> (c / 4)))
    ).toString(16),
  );
};

const normalizeDraft = (draft = {}) => ({
  draftId: draft?.draftId || randomDraftId(),
  blogId: draft?.blogId || null,
  mode: draft?.mode || "create",
  html: draft?.html || "<p></p>",
  title: draft?.title || "",
  tags: Array.isArray(draft?.tags) ? draft.tags : [],
  coverImageUrl: draft?.coverImageUrl || "",
  lastUpdated: draft?.lastUpdated || new Date().toISOString(),
});

const useBlogEditorDraft = () => {
  const loadDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;

      return normalizeDraft(JSON.parse(raw));
    } catch (error) {
      console.error("Failed to parse saved draft:", error);
      return null;
    }
  }, []);

  const saveDraft = useCallback((draft) => {
    try {
      const normalized = normalizeDraft({
        ...draft,
        lastUpdated: new Date().toISOString(),
      });

      localStorage.setItem(DRAFT_KEY, JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return null;
    }
  }, []);

  const clearDraft = useCallback(
    async (removeImages = false) => {
      const draft = loadDraft();
      localStorage.removeItem(DRAFT_KEY);

      if (removeImages && draft?.draftId) {
        await deleteDraftImages(draft.draftId);
      }
    },
    [loadDraft],
  );

  const isMeaningfulDraft = useCallback((draft) => {
    if (!draft) return false;

    return !isDraftEmpty(
      draft?.html || "<p></p>",
      draft?.title || "",
      draft?.coverImageUrl || "",
    );
  }, []);

  return {
    loadDraft,
    saveDraft,
    clearDraft,
    isMeaningfulDraft,
  };
};

export default useBlogEditorDraft;
