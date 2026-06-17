const express = require("express");
const router = express.Router();
const supabaseAdmin = require("../config/supabaseAdmin");

// GET /api/public/stats
router.get("/stats", async (req, res) => {
  try {
    const [
      { count: blogCount },
      { count: userCount },
      { data: viewsData },
      { data: trendingBlogs },
      { data: topAuthors },
      { data: popularTagsRaw },
    ] = await Promise.all([
      // Total published blogs
      supabaseAdmin
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),

      // Total users
      supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true }),

      // Total views (sum)
      supabaseAdmin
        .from("blogs")
        .select("views")
        .eq("status", "published"),

      // Trending blogs — top 3 by views
      supabaseAdmin
        .from("blogs")
        .select("id, title, tags, views, read_time, published_at, users(id, name, avatar)")
        .eq("status", "published")
        .order("views", { ascending: false })
        .limit(3),

      // Top authors — by follower count
      supabaseAdmin
        .from("users")
        .select("id, name, avatar, bio, followers_count")
        .order("followers_count", { ascending: false })
        .limit(4),

      // All tags from published blogs
      supabaseAdmin
        .from("blogs")
        .select("tags")
        .eq("status", "published"),
    ]);

    const totalViews = (viewsData || []).reduce(
      (sum, b) => sum + (b.views || 0),
      0
    );

    // Count tag frequency
    const tagFrequency = {};
    (popularTagsRaw || []).forEach((blog) => {
      (blog.tags || []).forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });
    const popularTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    res.json({
      stats: {
        blogCount: blogCount || 0,
        userCount: userCount || 0,
        totalViews,
      },
      trendingBlogs: trendingBlogs || [],
      topAuthors: topAuthors || [],
      popularTags,
    });
  } catch (err) {
    console.error("Public stats error:", err.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
