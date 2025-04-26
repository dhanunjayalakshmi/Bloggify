import {
  Bookmark,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const BlogCard = ({ blog, mode = "home", status }) => {
  const {
    cover_image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
    title = "My first blog",
    description = "Welcome to my first blog",
    author = "Dhanunjaya",
    tags = ["first", "blog"],
    rating = 20,
    views = 123,
    lastEdited = "2025-04-19",
    scheduledFor = "2025-04-25",
  } = blog;

  return (
    <Card className="rounded-2xl my-3 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:text-gray-200">
      <CardContent className="px-4 py-4 flex flex-col sm:flex-row gap-4">
        <img
          src={cover_image}
          alt={title}
          className="w-full sm:w-40 h-32 object-cover rounded-md"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {mode === "home" && (
            <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
              <span>By {author}</span>
              <span>{tags.join(", ")}</span>
              <span>⭐ {rating}</span>
              <div className="flex items-center gap-2">
                <ThumbsUp size={16} />
                <ThumbsDown size={16} />
                <MessageCircle size={16} />
              </div>
              <Bookmark size={16} />
            </div>
          )}

          {mode === "dashboard" && (
            <div className="flex justify-between w-full items-center">
              <span className="text-sm text-muted-foreground">
                {tags.join(", ")}
              </span>
              <div className="text-sm text-muted-foreground">
                {status === "published" && <span>🔥 {views} views</span>}
                {status === "draft" && <span>Last edited: {lastEdited}</span>}
                {status === "scheduled" && (
                  <span>Scheduled for: {scheduledFor}</span>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
