import {
  Bookmark,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

const BlogCardFooter = ({ blog, variant = "home", status }) => {
  const [isBookmarked, setIsBookmarked] = useState(true);

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success("Bookmark added");
    } else toast.success("Bookmark removed");
  };

  if (variant === "dashboard") {
    return (
      <div className="flex justify-between w-full items-center">
        <span className="text-sm text-muted-foreground">
          {blog.tags.join(", ")}
        </span>
        <div className="text-sm text-muted-foreground">
          {status === "published" && <span>🔥 {blog.views} views</span>}
          {status === "draft" && <span>Last edited: {blog.lastEdited}</span>}
          {status === "scheduled" && (
            <span>Scheduled for: {blog.scheduledFor}</span>
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

  if (variant === "bookmarks") {
    return (
      <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
        <span>By {blog.author}</span>
        <span>{blog.tags.join(", ")}</span>
        <span>⭐ {blog.rating}</span>
        <div className="flex items-center gap-4">
          <ThumbsUp size={16} />
          <ThumbsDown size={16} />
          <MessageCircle size={16} />
        </div>
        <Button
          variant="icon"
          onClick={toggleBookmark}
          className="hover:text-primary cursor-pointer"
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

  // Default home footer
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
      <span>By {blog.author}</span>
      <span>{blog.tags.join(", ")}</span>
      <span>⭐ {blog.rating}</span>
      <div className="flex items-center gap-4">
        <ThumbsUp size={16} />
        <ThumbsDown size={16} />
        <MessageCircle size={16} />
      </div>
      <Button variant="icon" className="hover:text-primary ">
        <Bookmark size={18} />
      </Button>
    </div>
  );
};

export default BlogCardFooter;
