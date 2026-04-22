const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

const formatTag = (tag) => {
  const normalized = String(tag || "")
    .trim()
    .replace(/^#/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "";
};

const getTagVariants = (tag) => {
  const formatted = formatTag(tag);
  return [...new Set([formatted, formatted.toLowerCase()].filter(Boolean))];
};

const buildBlogsQuery = (supabase, userId, queryParams) => {
  let {
    status = "published",
    search,
    sort = "recent",
    tags,
    from,
    to,
    page = 1,
    limit = 5,
  } = queryParams;

  page = Number(page);
  limit = Number(limit);

  if (!["published", "draft"].includes(status)) {
    status = "published";
  }

  const fromRange = (page - 1) * limit;
  const toRange = fromRange + limit;

  let query = supabase.from("blogs").select("*").eq("user_id", userId);
  if (status === "published") {
    query = query
      .eq("is_published", true)
      .lte("published_at", new Date().toISOString());
  }

  if (status === "draft") {
    query = query.eq("is_published", false);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (tags) {
    const tagList = tags.split(",").flatMap(getTagVariants);
    query = query.overlaps("tags", tagList);
  }

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  switch (sort) {
    case "oldest":
      query = query.order("updated_at", { ascending: true });
      break;

    case "views":
      query = query.order("views", { ascending: false });
      break;

    default:
      query = query.order("updated_at", { ascending: false });
  }

  query = query.range(fromRange, toRange);

  return { query, page, limit };
};

const getPreview = (html) => {
  if (!html) return "Welcome to my blog";

  return html.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
};

// Get all the logged-in user owned posts with stats for dashboard
router.get("/blog-stats", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;

    const { query, page, limit } = buildBlogsQuery(supabase, userId, req.query);

    const { data: blogs, error } = await query;

    if (error) throw error;

    const hasMore = (blogs?.length || 0) > limit;
    const pagedBlogs = hasMore ? blogs.slice(0, limit) : blogs;
    const blogIds = pagedBlogs?.map((blog) => blog?.id) || [];

    if (!blogIds?.length) {
      return res.json({
        blogs: [],
        page,
        limit,
        hasMore: false,
      });
    }

    // comments
    const { data: comments } = await supabase
      .from("comments")
      .select("blog_id", { count: "exact" })
      .in("blog_id", blogIds);

    // upvotes
    const { data: votes } = await supabase
      .from("votes")
      .select("content_id")
      .eq("content_type", "blog")
      .eq("vote_type", "upvote")
      .in("content_id", blogIds);

    const commentMap = {};
    const voteMap = {};

    blogIds.forEach((id) => {
      commentMap[id] = 0;
      voteMap[id] = 0;
    });

    comments?.forEach((c) => {
      commentMap[c.blog_id]++;
    });

    votes?.forEach((v) => {
      voteMap[v.content_id]++;
    });

    const result = pagedBlogs?.map((blog) => ({
      id: blog?.id,
      title: blog?.title,
      views: blog?.views,
      content: getPreview(blog?.content),
      tags: blog?.tags?.map(formatTag) || [],
      comments: commentMap[blog?.id],
      upvotes: voteMap[blog?.id],
      status: blog?.is_published ? "Published" : "Draft",
      updated: blog?.updated_at,
      created_at: blog?.created_at,
      is_published: blog?.is_published,
      published_at: blog?.published_at,
    }));

    res.json({
      blogs: result,
      page,
      limit,
      hasMore,
    });
  } catch (err) {
    console.error("Dashboard posts error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single post of author
router.get("/posts/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req?.params;
    const userId = req?.user?.id;

    const { data: blog, error } = await req?.supabase
      ?.from("blogs")
      ?.select(
        `
        *,
        users (
          name,
          avatar
        )
      `,
      )
      ?.eq("id", id)
      ?.eq("user_id", userId)
      ?.single();

    if (error || !blog) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.log("Error...", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all aggregated stats details of user owned blogs
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const userId = req.user.id;
    const nowIso = new Date().toISOString();

    const { data: publishedBlogs, error: blogsError } = await supabase
      .from("blogs")
      .select("id, views")
      .eq("user_id", userId)
      .eq("is_published", true)
      .lte("published_at", nowIso);

    if (blogsError) throw blogsError;

    const blogIds = publishedBlogs?.map((b) => b.id);

    const totalViews = publishedBlogs?.reduce(
      (sum, b) => sum + (b.views || 0),
      0,
    );

    if (!blogIds?.length) {
      return res.json({
        totalBlogs: 0,
        totalViews: 0,
        totalComments: 0,
        totalUpvotes: 0,
      });
    }

    const { count: totalComments, error: commentsError } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .in("blog_id", blogIds);

    if (commentsError) throw commentsError;

    // Count upvotes on user's blogs
    const { count: totalUpvotes, error: votesError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("content_type", "blog")
      .eq("vote_type", "upvote")
      .in("content_id", blogIds);

    if (votesError) throw votesError;

    res.json({
      totalBlogs: publishedBlogs?.length,
      totalViews,
      totalComments: totalComments || 0,
      totalUpvotes: totalUpvotes || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
