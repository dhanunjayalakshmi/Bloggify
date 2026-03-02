import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MiniBlogList = ({ title, blogs = [], seeMorePath }) => {
  const navigate = useNavigate();

  if (!blogs?.length) return null;

  return (
    <Card className="dark:bg-gray-800">
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">{title}</h2>

        {blogs?.map((blog) => (
          <div
            key={blog?.id}
            onClick={() => navigate(`/blogs/${blog?.id}`)}
            className="flex items-center gap-3 mb-4 cursor-pointer"
          >
            <img
              src={blog?.cover_image || "/placeholder.png"}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="text-sm">
              <p className="font-medium line-clamp-1">{blog?.title}</p>
              <p className="text-muted-foreground text-xs">
                {blog?.users?.username}
              </p>
            </div>
          </div>
        ))}

        {seeMorePath && (
          <Button
            variant="outline"
            className="w-full text-sm"
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
