import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye, MessageCircle, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const EMOJIS = ["❤️", "🔥", "💡", "🤔", "🎉"];
const REACTION_COLORS = {
  "❤️": "#ef4444",
  "🔥": "#f97316",
  "💡": "#eab308",
  "🤔": "#8b5cf6",
  "🎉": "#22c55e",
};

export default function BlogAnalytics({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return <p className="text-muted-foreground">No analytics data yet.</p>;
  }

  // --- Core stats ---
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
    const topRate = (topEngaged.upvotes + topEngaged.comments) / (topEngaged.views || 1);
    if (engagementRate > topRate) topEngaged = blog;
    return { ...blog, engagement, engagementRate };
  });

  const avgEngagementRate =
    totalViews === 0 ? 0 : ((totalEngagement / totalViews) * 100).toFixed(2);
  const topEngagementRate = (
    ((topEngaged.upvotes + topEngaged.comments) / (topEngaged.views || 1)) * 100
  ).toFixed(2);

  const topBlogs = [...blogWithRates]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);

  // --- Tag performance ---
  const tagStats = {};
  blogs.forEach((blog) => {
    blog.tags?.forEach((tag) => {
      if (!tagStats[tag]) tagStats[tag] = { views: 0, engagement: 0, count: 0 };
      tagStats[tag].views += blog.views || 0;
      tagStats[tag].engagement += (blog.upvotes || 0) + (blog.comments || 0);
      tagStats[tag].count++;
    });
  });
  const topTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b.views - a.views)
    .slice(0, 6)
    .map(([tag, stats]) => ({
      tag: tag.length > 12 ? tag.slice(0, 12) + "…" : tag,
      avgViews: Math.round(stats.views / stats.count),
      engagement: stats.engagement,
    }));

  // --- Reactions summary ---
  const totalReactions = {};
  EMOJIS.forEach((e) => (totalReactions[e] = 0));
  blogs.forEach((blog) => {
    Object.entries(blog.reactions || {}).forEach(([emoji, count]) => {
      if (totalReactions[emoji] !== undefined) totalReactions[emoji] += count;
    });
  });
  const reactionsData = EMOJIS.map((emoji) => ({
    emoji,
    count: totalReactions[emoji],
  })).filter((r) => r.count > 0);

  // --- Content length insights ---
  const byLength = {
    "Short (≤3 min)": { views: [], count: 0 },
    "Medium (4–7 min)": { views: [], count: 0 },
    "Long (8+ min)": { views: [], count: 0 },
  };
  blogs.forEach((blog) => {
    const rt = blog.read_time || 1;
    const key =
      rt <= 3 ? "Short (≤3 min)" : rt <= 7 ? "Medium (4–7 min)" : "Long (8+ min)";
    byLength[key].views.push(blog.views || 0);
    byLength[key].count++;
  });
  const lengthData = Object.entries(byLength)
    .filter(([, v]) => v.count > 0)
    .map(([label, v]) => ({
      label,
      avgViews: Math.round(v.views.reduce((a, b) => a + b, 0) / v.count),
      count: v.count,
    }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <TrendingUp className="text-green-500 mt-1" size={32} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Top Performing Blog</p>
              <h3 className="text-base font-semibold">{topEngaged.title}</h3>
              <p className="text-sm text-muted-foreground">Engagement Rate: {topEngagementRate}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <Eye className="text-blue-500 mt-1" size={32} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Most Viewed Blog</p>
              <h3 className="text-base font-semibold">{mostViewed.title}</h3>
              <p className="text-sm text-muted-foreground">Views: {mostViewed.views}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <MessageCircle className="text-orange-500 mt-1" size={32} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Most Discussed Blog</p>
              <h3 className="text-base font-semibold">{mostCommented.title}</h3>
              <p className="text-sm text-muted-foreground">Comments: {mostCommented.comments}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 flex items-start gap-3">
            <BarChart3 className="text-purple-500 mt-1" size={32} />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Engagement Rate</p>
              <h3 className="text-base font-semibold">{avgEngagementRate}%</h3>
              <p className="text-sm text-muted-foreground">Based on all posts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Blogs */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-base font-semibold">Top 3 by Engagement Rate</h3>
          <div className="space-y-2">
            {topBlogs.map((blog, index) => (
              <div key={blog.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-none">
                <span className="text-sm font-medium">{index + 1}. {blog.title}</span>
                <span className="text-sm text-muted-foreground">{(blog.engagementRate * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tag Performance */}
      {topTags.length > 0 && (
        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-base font-semibold">Tag Performance</h3>
            <p className="text-xs text-muted-foreground">Average views per blog for each tag</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTags} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="tag" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip
                    formatter={(value) => [value, "Avg Views"]}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Bar dataKey="avgViews" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reactions Summary */}
      {reactionsData.length > 0 && (
        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-base font-semibold">Reactions Summary</h3>
            <p className="text-xs text-muted-foreground">Total reactions across all your blogs</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reactionsData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emoji" tick={{ fontSize: 18 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [value, "Reactions"]}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
                    {reactionsData.map((entry) => (
                      <Cell key={entry.emoji} fill={REACTION_COLORS[entry.emoji] || "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Length Insights */}
      {lengthData.length > 0 && (
        <Card className="dark:bg-gray-900">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-base font-semibold">Content Length vs Views</h3>
            <p className="text-xs text-muted-foreground">Which read length gets the most views on average</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lengthData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, name) => [value, name === "avgViews" ? "Avg Views" : name]}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Bar dataKey="avgViews" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              {lengthData.map((d) => (
                <span key={d.label}>{d.label}: {d.count} blog{d.count !== 1 ? "s" : ""}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
