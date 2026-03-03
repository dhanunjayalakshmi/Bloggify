import { useEffect } from "react";
import { useBookmarkStore } from "@/stores/bookmarksStore";

const useSidebarBookmarks = (limit = 5) => {
  const { bookmarkList, fetchBookmarkedBlogs } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarkedBlogs();
  }, []);

  const sliced = bookmarkList?.slice(0, limit) || [];

  return {
    blogs: sliced,
    hasBookmarks: bookmarkList?.length > 0,
  };
};

export default useSidebarBookmarks;
