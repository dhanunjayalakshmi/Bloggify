import { Card, CardContent } from "../ui/card";
import BlogCardFooter from "./BlogCardFooter";
import useBookmark from "@/hooks/useBookmark";

const BlogCard = ({ blog, onOpen }) => {
  const { isBookmarked, toggle } = useBookmark(blog?.id);

  const { cover_image, title = "My first blog", content } = blog;

  const coverImage = cover_image
    ? cover_image
    : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  return (
    <Card
      onClick={onOpen}
      className="cursor-pointer rounded-2xl my-3 shadow-sm hover:shadow-md transition dark:bg-gray-800 dark:text-gray-200"
    >
      <CardContent className="px-4 py-4 flex flex-col sm:flex-row gap-4">
        <img
          src={coverImage}
          alt={title}
          className="w-full sm:w-40 h-32 object-cover rounded-md"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-muted-foreground">
              {content?.replace(/<[^>]*>/g, "").substring(0, 150) + "..." ||
                "Welcome to my blog"}
            </p>
          </div>

          {/* Footer Section */}
          <BlogCardFooter
            blog={blog}
            isBookmarked={isBookmarked}
            onBookmarkToggle={toggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
