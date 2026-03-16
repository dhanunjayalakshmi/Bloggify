import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye, MessageCircle, BarChart3 } from "lucide-react";

export default function BlogAnalytics({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return <p className="text-muted-foreground">No analytics data yet.</p>;
  }

  let mostViewed = blogs[0];
  let mostCommented = blogs[0];
  let topEngaged = blogs[0];

  let totalViews = 0;
  let totalEngagement = 0;

  const blogWithRates = blogs.map((blog) => {
    const engagement = blog.upvotes + blog.comments;
    const engagementRate = engagement / (blog.views || 1);

    totalViews += blog.views;
    totalEngagement += engagement;

    if (blog.views > mostViewed.views) mostViewed = blog;
    if (blog.comments > mostCommented.comments) mostCommented = blog;

    const topRate =
      (topEngaged.upvotes + topEngaged.comments) / (topEngaged.views || 1);

    if (engagementRate > topRate) topEngaged = blog;

    return {
      ...blog,
      engagementRate,
    };
  });

  const avgEngagementRate =
    totalViews === 0 ? 0 : ((totalEngagement / totalViews) * 100).toFixed(2);

  const engagementRate = (
    ((topEngaged.upvotes + topEngaged.comments) / (topEngaged.views || 1)) *
    100
  ).toFixed(2);

  // Top 3 blogs by engagement rate
  const topBlogs = [...blogWithRates]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <TrendingUp className="text-green-500 mt-1" size={32} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Top Performing Blog
              </p>
              <h3 className="text-lg font-semibold">{topEngaged.title}</h3>
              <p className="text-sm text-muted-foreground">
                Engagement Rate: {engagementRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <Eye className="text-blue-500 mt-1" size={40} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Most Viewed Blog</p>
              <h3 className="text-lg font-semibold">{mostViewed.title}</h3>
              <p className="text-sm text-muted-foreground">
                Views: {mostViewed.views}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <MessageCircle className="text-orange-500 mt-1" size={40} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Most Discussed Blog
              </p>
              <h3 className="text-lg font-semibold">{mostCommented.title}</h3>
              <p className="text-sm text-muted-foreground">
                Comments: {mostCommented.comments}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <BarChart3 className="text-purple-500 mt-1" size={32} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Average Engagement Rate
              </p>
              <h3 className="text-lg font-semibold">{avgEngagementRate}%</h3>
              <p className="text-sm text-muted-foreground">
                Based on all posts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Blogs */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Top Performing Blogs</h3>

          <div className="space-y-2">
            {topBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className="flex justify-between items-center border-b pb-2 last:border-none"
              >
                <span className="text-sm font-medium">
                  {index + 1}. {blog.title}
                </span>

                <span className="text-sm text-muted-foreground">
                  {(blog.engagementRate * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
