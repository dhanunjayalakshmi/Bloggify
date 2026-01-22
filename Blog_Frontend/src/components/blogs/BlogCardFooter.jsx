import { Bookmark, MessageCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import ContentVotes from "./ContentVotes";
import { useCommentCountStore } from "@/stores/commentCountStore";

const BlogCardFooter = ({
  blog,
  variant = "home",
  status,
  isBookmarked,
  onBookmarkToggle,
}) => {
  const stop = (e) => e.stopPropagation();
  const count = useCommentCountStore(
    (store) => store?.countsByBlogId[blog?.id] ?? 0,
  );

  if (variant === "dashboard") {
    return (
      <div onClick={stop} className="flex justify-between w-full items-center">
        <span className="text-sm text-muted-foreground">
          {blog?.tags?.join(", ")}
        </span>

        <div className="text-sm text-muted-foreground">
          {status === "published" && <span>🔥 {blog?.views} views</span>}
          {status === "draft" && <span>Last edited: {blog?.lastEdited}</span>}
          {status === "scheduled" && (
            <span>Scheduled for: {blog?.scheduledFor}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="hover:dark:bg-gray-700">
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:dark:bg-gray-700"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "home" || variant === "bookmarks") {
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
  }

  return null;
};

export default BlogCardFooter;
