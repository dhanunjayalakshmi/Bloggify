import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardPostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <h3 className="font-semibold">{post?.title}</h3>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {post?.content?.slice(0, 120)}...
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">
          Updated: {new Date(post?.updated_at).toLocaleDateString()}
        </span>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/edit/${post?.id}`)}
          >
            Edit
          </Button>

          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPostCard;
