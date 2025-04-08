import { Bookmark, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const BlogCard = ({ blog }) => {
  const { cover_image, title, description, author, tags, rating } = {
    cover_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
    title: "My first blog",
    description: "Welcome to my first blog",
    author: "Dhanunjaya",
    tags: ["first", "blog"],
    rating: 20,
  };

  console.log(blog);

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow:md transition dark:bg-gray-800 dark:text-gray-200">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
        <img
          src={cover_image}
          alt={title}
          className="w-full sm:w-40 h-32 object-cover rounded-md "
        />
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
            <span>{author}</span>
            <span>{tags.join(", ")}</span>
            <span>⭐ {rating}</span>
            <div className="flex items-center gap-2">
              <ThumbsUp size={16} />
              <ThumbsDown size={16} />
              <MessageCircle size={16} />
            </div>
            <Bookmark size={16} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
