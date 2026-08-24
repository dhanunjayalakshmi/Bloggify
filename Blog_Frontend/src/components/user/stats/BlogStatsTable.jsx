import { Eye, ThumbsUp, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { parseUTC } from "@/utils/parseUTC";

const BlogStatsTable = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No blog stats available.</p>
    );
  }

  // Calculate engagement rate
  const blogsWithStats = blogs.map((blog) => {
    const engagement = blog.upvotes + blog.comments;

    const engagementRate = blog.views === 0 ? 0 : engagement / blog.views;

    return {
      ...blog,
      engagement,
      engagementRate,
    };
  });

  // Sort by engagement rate
  const sortedBlogs = [...blogsWithStats].sort(
    (a, b) => b.engagementRate - a.engagementRate,
  );

  // For progress bar scaling
  const maxEngagement = Math.max(...sortedBlogs.map((b) => b.engagement));

  return (
    <div className="space-y-4">
      {sortedBlogs.map((blog, index) => {
        const engagementPercent =
          maxEngagement === 0 ? 0 : (blog.engagement / maxEngagement) * 100;

        return (
          <div
            key={blog.id}
            className="rounded-lg border bg-background dark:bg-gray-900 dark:border-gray-700 p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground">
                    #{index + 1}
                  </span>

                  <h3 className="font-semibold text-base">{blog.title}</h3>
                </div>

                <p className="text-xs text-muted-foreground">
                  Updated {parseUTC(blog.updated)?.toLocaleDateString()}
                </p>
              </div>

              <Badge
                variant={blog.status === "Published" ? "default" : "secondary"}
              >
                {blog.status}
              </Badge>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye size={16} />
                <span>{blog.views}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <ThumbsUp size={16} />
                <span>{blog.upvotes}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle size={16} />
                <span>{blog.comments}</span>
              </div>
            </div>

            {/* Reactions */}
            {blog.reactions && Object.keys(blog.reactions).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(blog.reactions).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {emoji} {count}
                  </span>
                ))}
              </div>
            )}

            {/* Engagement Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Engagement</span>
                <span>{(blog.engagementRate * 100).toFixed(2)}%</span>
              </div>

              <div className="w-full h-2 bg-muted rounded">
                <div
                  className="h-2 bg-indigo-500 rounded"
                  style={{
                    width: `${engagementPercent}%`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogStatsTable;
