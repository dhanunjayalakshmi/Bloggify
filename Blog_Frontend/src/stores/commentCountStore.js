import { create } from "zustand";

export const useCommentCountStore = create((set) => ({
  countsByBlogId: {},

  setCounts: (countsArray) =>
    set((state) => {
      const updated = { ...state.countsByBlogId };

      countsArray.forEach(({ blog_id, count }) => {
        updated[blog_id] = count;
      });

      return { countsByBlogId: updated };
    }),
}));
