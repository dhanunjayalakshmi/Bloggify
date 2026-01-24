const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Get all the logged-in user owned posts for dashboard
router.get("/posts", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const userId = req?.user?.id;

    let {
      status = "published",
      search,
      sort = "recent",
      tags,
      from,
      to,
      page = 1,
      limit = 10,
    } = req?.query;

    page = Number(page);
    limit = Number(limit);

    const fromRange = (page - 1) * limit;
    const toRange = fromRange + limit - 1;

    let query = supabase?.from("blogs")?.select("*")?.eq("user_id", userId);

    // Status
    if (status === "published") {
      query = query
        ?.eq("is_published", true)
        ?.lte("published_at", new Date().toISOString());
    }

    if (status === "draft") {
      query = query?.eq("is_published", false);
    }

    if (search) {
      query = query?.ilike("title", `%${search}%`);
    }

    if (tags) {
      const tagList = tags?.split(",")?.map((t) => t.trim().toLowerCase());
      query = query?.contains("tags", tagList);
    }

    if (from) query = query?.gte("created_at", from);
    if (to) query = query?.lte("created_at", to);

    // sort
    switch (sort) {
      case "oldest":
        query = query?.order("updated_at", { ascending: true });
        break;

      case "views":
        query = query?.order("views", { ascending: false });
        break;

      case "recent":
      default:
        query = query?.order("updated_at", { ascending: false });
    }

    // pagination
    query = query?.range(fromRange, toRange);

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json({
      blogs: data,
      page,
      limit,
      hasMore: data.length === limit,
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
    conaole.log("Error...", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all stats details of user owned blogs
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const userId = req?.user?.id;

    const [
      { count: blogs },
      //   { data: viewsData },
      { count: comments },
      { count: upvotes },
    ] = await Promise.all([
      supabase
        ?.from("blogs")
        ?.select("*", { count: "exact", head: true })
        ?.eq("user_id", userId),
      supabase
        ?.from("comments")
        ?.select("*", { count: "exact", head: true })
        ?.eq("user_id", userId),
      supabase
        ?.from("votes")
        ?.select("*", { count: "exact", head: true })
        ?.eq("vote_type", "upvote")
        ?.eq("user_id", userId),
    ]);

    // const totalViews =
    //   viewsData?.reduce((sum, blog) => sum + (blog?.views || 0), 0) || 0;

    res.json({
      totalBlogs: blogs || 0,
      //   totalViews,
      totalComments: comments || 0,
      totalUpvotes: upvotes || 0,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res?.status(500)?.json({ error: err?.message });
  }
});

// Get all Blog-wise stats
router.get("/blog-stats", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const userId = req?.user?.id;
    const { blogIds } = req?.query;

    if (!blogIds) {
      return res.status(400).json({ error: "blogIds required" });
    }

    const ids = typeof blogIds === "String" ? blogIds?.split(",") : blogIds;

    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("blog_id", { count: "exact" })
      .in("blog_id", ids);

    if (commentsError) throw commentsError;

    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select("content_id, vote_type")
      .eq("content_type", "blog")
      .eq("vote_type", "upvote")
      .in("content_id", ids);

    if (votesError) throw votesError;

    const result = {};

    ids?.forEach((id) => {
      result[id] = { comments: 0, upvotes: 0 };
    });

    comments?.forEach((comment) => {
      result[comment?.blog_id].comments += 1;
    });

    votes?.forEach((vote) => {
      result[vote?.content_id].upvotes += 1;
    });

    res.status(200).json(result);

    // const result = blogs?.map((blog) => ({
    //   id: blog?.id,
    //   title: blog?.title,
    //   views: blog?.views || 0,
    //   comments: blog?.comments?.[0]?.count || 0,
    //   upvotes: blog?.upvotes?.[0]?.count || 0,
    //   status: blog?.is_published
    //     ? blog?.published_at
    //       ? "Published"
    //       : "Scheduled"
    //     : "Draft",
    // }));

    // res?.json(result);
  } catch (err) {
    res?.status(500)?.json({ error: err?.message });
  }
});

module.exports = router;
