import { Card, CardContent } from "../ui/card";
import BlogCardFooter from "./BlogCardFooter";

const BlogCard = ({ blog, footerVariant = "home", status }) => {
  const {
    cover_image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
    title = "My first blog",
    content,
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
            <p className="text-muted-foreground">
              {content?.replace(/<[^>]*>/g, "").substring(0, 150) + "..." ||
                "Welcome to my blog"}
            </p>
          </div>

          {/* Footer Section */}
          <BlogCardFooter blog={blog} variant={footerVariant} status={status} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
