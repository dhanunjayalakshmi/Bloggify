import { toggleBookmark } from "@/services/bookmarkService";
import { useBookmarkStore } from "@/stores/bookmarksStore";
import { toast } from "sonner";

const useBookmark = (blogId) => {
  const isBookmarked = useBookmarkStore((store) => store?.isBookmarked(blogId));
  const add = useBookmarkStore((store) => store?.add);
  const remove = useBookmarkStore((store) => store?.remove);

  const toggle = async () => {
    try {
      await toggleBookmark(blogId);

      if (isBookmarked) {
        remove(blogId);
        toast.success("Bookmark removed");
      } else {
        add(blogId);
        toast.success("Bookmark added");
      }
    } catch {
      toast.error("Bookmark failed");
    }
  };

  return { isBookmarked, toggle };
};

export default useBookmark;
