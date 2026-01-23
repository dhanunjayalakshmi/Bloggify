import { Button } from "@/components/ui/button";
// import { Edit, Trash2 } from "lucide-react";
import { useMemo } from "react";
// import { useNavigate } from "react-router-dom";

const DashboardPostCard = ({ post, stats, onOpen }) => {
  //   const navigate = useNavigate();

  const preview = useMemo(() => {
    if (!post?.content) return "Welcome to my blog";
    return post.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
  }, [post?.content]);

  const status = useMemo(() => {
    if (!post?.is_published) {
      if (post?.published_at && new Date(post?.published_at) > new Date()) {
        return "scheduled";
      }
      return "draft";
    }
    return "published";
  }, [post]);

  return (
    <div
      onClick={onOpen}
      className="cursor-pointer rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {post?.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Last updated: {new Date(post?.updated_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-muted-foreground text-md">{preview}</p>
        </div>

        {/* <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/edit/${post?.id}`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>

          <Button size="sm" variant="destructive">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div> */}
      </div>

      {status === "published" && (
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span>👀 {post?.views ?? 0}</span>
          <span>💬 {stats?.comments ?? 0}</span>
          <span>👍 {stats?.upvotes ?? 0}</span>
        </div>
      )}

      {status === "scheduled" && (
        <span className="inline-block rounded bg-orange-400 px-2 py-0.5 text-xs dark:text-black">
          Scheduled for: {new Date(post.published_at).toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default DashboardPostCard;
