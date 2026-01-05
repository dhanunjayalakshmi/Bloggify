import { create } from "zustand";
import { getBookmarks } from "@/services/bookmarkService";

export const useBookmarkStore = create((set, get) => ({
  bookmarks: new Set(),
  bookmarkList: [],
  loading: false,

  fetchBookmarks: async () => {
    set({ loading: true });
    const data = await getBookmarks();

    set({
      bookmarks: new Set(data?.bookmarks?.map((b) => b?.blog_id)),
      bookmarkList: data?.blogs ?? [],
      loading: false,
    });
  },

  isBookmarked: (blogId) => get()?.bookmarks?.has(blogId),

  add: (blogId) =>
    set((state) => ({
      bookmarks: new Set(state?.bookmarks)?.add(blogId),
    })),

  remove: (blogId) =>
    set((state) => {
      const next = new Set(state?.bookmarks);
      next?.delete(blogId);
      return { bookmarks: next };
    }),
}));
