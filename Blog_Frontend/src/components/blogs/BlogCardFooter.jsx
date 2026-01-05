import {
  Bookmark,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";

const BlogCardFooter = ({
  blog,
  variant = "home",
  status,
  isBookmarked,
  toggleBookmark,
}) => {
  const stop = (e) => e.stopPropagation();

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

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <ThumbsUp size={16} />
            10
          </div>
          <div className="flex gap-1">
            <ThumbsDown size={16} />2
          </div>
          <div className="flex gap-1">
            <MessageCircle size={16} />8
          </div>
        </div>
        <Button
          size="icon"
          variant="ghostButton"
          aria-label="Bookmark"
          onClick={toggleBookmark}
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
