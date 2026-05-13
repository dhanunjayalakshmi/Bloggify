import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MiniBlogList = ({
  title,
  blogs = [],
  seeMorePath,
  fullWidth = false,
}) => {
  const navigate = useNavigate();

  if (!blogs?.length) return null;

  return (
    <Card className="w-full dark:bg-gray-800 dark:text-gray-200">
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">{title}</h2>

        {blogs?.map((blog) => (
          <div
            key={blog?.id}
            onClick={() => navigate(`/blogs/${blog?.id}`)}
            className="flex items-center dark:bg-gray-900 gap-3 mb-4 p-2 cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <img
              src={
                blog?.cover_image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
              }
              alt={blog?.title || "Blog cover"}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
            <div className="text-sm gap-2">
              <p className="font-medium line-clamp-1">{blog?.title}</p>
              <p className="text-muted-foreground">
                {blog?.content?.replace(/<[^>]*>/g, "").substring(0, 70) +
                  "..."}
              </p>
              <p className="text-muted-foreground text-xs">
                {blog?.users?.username}
              </p>
            </div>
          </div>
        ))}

        {seeMorePath && (
          <Button
            className={`${fullWidth ? "w-full" : "w-auto"} text-sm`}
            onClick={() => navigate(seeMorePath)}
          >
            See More
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniBlogList;
