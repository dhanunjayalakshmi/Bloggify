import { create } from "zustand";
import { getBookmarkedBlogs, getBookmarks } from "@/services/bookmarkService";

export const useBookmarkStore = create((set, get) => ({
  bookmarks: new Set(),
  bookmarkList: [],
  loading: false,

  fetchBookmarks: async () => {
    set({ loading: true });
    const data = await getBookmarks();

    set({
      bookmarks: new Set(data?.bookmarks?.map((blog) => blog?.blog_id)),
      loading: false,
    });
  },

  fetchBookmarkedBlogs: async () => {
    set({ loading: true });

    const blogs = await getBookmarkedBlogs();

    set({
      bookmarkList: blogs,
      bookmarks: new Set(blogs?.map((blog) => blog?.id)),
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
