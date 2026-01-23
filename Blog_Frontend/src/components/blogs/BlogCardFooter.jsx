import { Bookmark, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import ContentVotes from "./ContentVotes";
import { useCommentCountStore } from "@/stores/commentCountStore";

const BlogCardFooter = ({ blog, isBookmarked, onBookmarkToggle }) => {
  const stop = (e) => e.stopPropagation();
  const count = useCommentCountStore(
    (store) => store?.countsByBlogId[blog?.id] ?? 0,
  );

  return (
    <div
      onClick={stop}
      className="flex justify-between items-center text-sm text-muted-foreground mt-2"
    >
      <span>By {blog?.author}</span>
      <span>{blog?.tags?.join(", ")}</span>
      <span>🔥 {blog?.views} views</span>

      <div className="flex items-center gap-4">
        <ContentVotes contentId={blog?.id} contentType="blog" disabled />

        <div className="flex gap-1">
          <MessageCircle size={16} /> {count}
        </div>
      </div>
      <Button
        size="icon"
        variant="ghostButton"
        aria-label="Bookmark"
        onClick={onBookmarkToggle}
        className="transition-transform transform hover:scale-110 active:scale-90"
      >
        <Bookmark
          size={18}
          className={`${
            isBookmarked ? "fill-black dark:fill-white" : "fill-none"
          } stroke-current`}
        />
      </Button>
    </div>
  );
};

export default BlogCardFooter;
