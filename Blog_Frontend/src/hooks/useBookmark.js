import { useState } from "react";
import { addBookmark, removeBookmark } from "@/services/bookmarkService";
import { toast } from "sonner";

const useBookmark = ({ blogId, initialBookmarked = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      setIsBookmarked((prev) => !prev);

      if (!isBookmarked) {
        await addBookmark(blogId);
        toast.success("Bookmark added");
      } else {
        await removeBookmark(blogId);
        toast.success("Bookmark removed");
      }
    } catch {
      setIsBookmarked((prev) => !prev);
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return {
    isBookmarked,
    toggleBookmark,
    loading,
  };
};

export default useBookmark;
