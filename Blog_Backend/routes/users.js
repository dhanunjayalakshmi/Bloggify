const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { attachFollowState } = require("../utils/followHelpers");
const supabaseAdmin = require("../config/supabaseAdmin");

const router = express.Router();

// Get Self Profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const authId = req?.user?.auth_id;
    const nowIso = new Date().toISOString();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error) throw error;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Aggregate stats
    const [
      { count: blogs_published },
      { count: followers },
      { count: following },
    ] = await Promise?.all([
      supabase
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_published", true)
        .lte("published_at", nowIso),

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id),

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id),
    ]);

    const { data: userBlogs, error: blogsError } = await supabase
      .from("blogs")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_published", true)
      .lte("published_at", nowIso);

    if (blogsError) throw blogsError;

    const blogIds = userBlogs?.map((b) => b.id) || [];

    let total_upvotes = 0;
    let total_comments = 0;

    if (blogIds.length > 0) {
      const [
        { count: upvotesCount, error: votesError },
        { count: commentsCount, error: commentsError },
      ] = await Promise.all([
        supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .in("content_id", blogIds)
          .eq("content_type", "blog")
          .eq("vote_type", "upvote"),
        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .in("blog_id", blogIds),
      ]);

      if (votesError) throw votesError;
      if (commentsError) throw commentsError;

      total_upvotes = upvotesCount || 0;
      total_comments = commentsCount || 0;
    }

    res.json({
      id: user?.id,
      username: user?.username,
      full_name: user?.name,
      avatar: user?.avatar,
      bio: user?.bio,
      location: user?.location,
      is_profile_public: user?.is_profile_public,
      social_links: user?.social_links || {},
      stats: {
        blogs_published: blogs_published || 0,
        followers: followers || 0,
        following: following || 0,
        total_upvotes: total_upvotes || 0,
        total_comments: total_comments || 0,
      },
      account_metadata: {
        join_date: user?.created_at,
        last_active_at: user?.last_active_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update last active timestamp (called on login, logout, and tab close)
router.post("/me/ping", verifyToken, async (req, res) => {
  try {
    await supabaseAdmin
      .from("users")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", req.user.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reading history
router.get("/me/history", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("blog_views")
      .select(`
        last_viewed_at,
        blogs (
          id, title, description, cover_image, tags, read_time, views, published_at,
          users ( id, name, username, avatar )
        )
      `)
      .eq("user_id", userId)
      .order("last_viewed_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const history = (data || [])
      .filter((row) => row.blogs)
      .map((row) => ({ ...row.blogs, read_at: row.last_viewed_at }));

    res.json({ history, page, hasMore: data?.length === limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/me/history", verifyToken, async (req, res) => {
  try {
    const { error } = await req.supabase
      .from("blog_views")
      .delete()
      .eq("user_id", req.user.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/me/history/:blogId", verifyToken, async (req, res) => {
  try {
    const { error } = await req.supabase
      .from("blog_views")
      .delete()
      .eq("user_id", req.user.id)
      .eq("blog_id", req.params.blogId);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Profile Suggestions
router.get("/suggestions", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const { data: followingRows, error: followingError } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", currentUserId);

    if (followingError) throw followingError;

    const followingIds = (followingRows || []).map((row) => row.following_id);

    let query = supabase
      .from("users")
      .select(
        `
        id,
        username,
        name,
        avatar,
        blogs:blogs(count)
      `,
      )
      .neq("id", currentUserId);

    if (followingIds?.length > 0) {
      const formatted = followingIds.join(",");
      query = query.not("id", "in", `(${formatted})`);
    }

    const { data, error } = await query;

    if (error) throw error;

    const sorted = (data || [])
      .sort((a, b) => (b.blogs?.length || 0) - (a.blogs?.length || 0))
      .slice(0, limit);

    const users = await attachFollowState(supabase, currentUserId, sorted);

    res.json({ users });
  } catch (err) {
    console.error("Profile suggestions error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get other Profile Suggestions
router.get("/explore", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const userId = req?.user.id;

    // Users current user is already following
    const { data: following } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    const followingIds = following?.map((f) => f.following_id) || [];

    let query = supabase
      .from("users")
      .select("id, name, username, bio, avatar")
      .neq("id", userId); // remove self

    if (followingIds?.length > 0) {
      const formatted = followingIds.join(",");
      query = query.not("id", "in", `(${formatted})`);
    }

    // ---------- Suggested Users ----------
    const { data: suggestedRaw } = await query.limit(10);

    // ---------- Popular Users ----------
    const { data: popularRaw } = await supabase.rpc("get_popular_users", {
      current_user_id: userId,
      limit_count: 10,
    });

    // ---------- Active Users ----------
    const { data: activeRaw } = await supabase.rpc("get_active_users", {
      current_user_id: userId,
      limit_count: 10,
    });

    const suggested = await attachFollowState(
      supabase,
      userId,
      suggestedRaw || [],
    );
    const popular = await attachFollowState(supabase, userId, popularRaw || []);
    const active = await attachFollowState(supabase, userId, activeRaw || []);

    res.json({
      suggested: suggested || [],
      popular: popular || [],
      active: active || [],
    });
  } catch (err) {
    console.error("Explore users error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Search users by username (for @mentions)
router.get("/search", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const q = (req.query.q || "").trim();

    if (!q) return res.json({ users: [] });

    const { data, error } = await supabase
      .from("users")
      .select("id, name, username, avatar")
      .ilike("username", `${q}%`)
      .neq("id", userId)
      .limit(5);

    if (error) throw error;

    res.json({ users: data || [] });
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Author Public Profile
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const { userId } = req?.params;
    const viewerId = req?.user?.id;
    const nowIso = new Date().toISOString();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.is_profile_public && viewerId !== user.id) {
      return res.json({ message: "Profile is private" });
    }

    const [
      { count: blogs_published },
      { count: followers },
      { count: following },
    ] = await Promise?.all([
      supabase
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_published", true)
        .lte("published_at", nowIso),

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id),

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id),
    ]);

    const { data: userBlogs, error: blogsError } = await supabase
      .from("blogs")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_published", true)
      .lte("published_at", nowIso);

    if (blogsError) throw blogsError;

    const blogIds = userBlogs?.map((b) => b.id) || [];

    let total_upvotes = 0;
    let total_comments = 0;

    if (blogIds.length > 0) {
      const [
        { count: upvotesCount, error: votesError },
        { count: commentsCount, error: commentsError },
      ] = await Promise.all([
        supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .in("content_id", blogIds)
          .eq("content_type", "blog")
          .eq("vote_type", "upvote"),
        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .in("blog_id", blogIds),
      ]);

      if (votesError) throw votesError;
      if (commentsError) throw commentsError;

      total_upvotes = upvotesCount || 0;
      total_comments = commentsCount || 0;
    }

    res.json({
      username: user?.username,
      full_name: user?.name,
      avatar: user?.avatar,
      bio: user?.bio,
      location: user?.location,
      social_links: user?.social_links || {},
      stats: {
        blogs_published: blogs_published || 0,
        followers: followers || 0,
        following: following || 0,
        total_upvotes: total_upvotes || 0,
        total_comments: total_comments || 0,
      },
      account_metadata: {
        join_date: user?.created_at,
        last_active_at: user?.last_active_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET public blogs of an author (paginated)
router.get("/:username/blogs", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const { username } = req?.params;
    let { page = 1, limit = 5 } = req?.query;

    page = Number(page);
    limit = Number(limit);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Find user by username
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_published", true)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      blogs,
      page,
      hasMore: blogs.length === limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Save user details after Signup
router.post("/", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const { id, email, name = "New User", bio = "", avatar = "" } = req?.body;

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingUser) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ name, bio, avatar })
        .eq("auth_id", id);

      if (updateError) throw updateError;

      return res.json({ message: "User details updated successfully" });
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert({ auth_id: id, name, email, bio, avatar });

    if (insertError) throw insertError;

    res.json({ message: "User created Successfully" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//Update User Profile
router.put("/me", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const authId = req?.user?.auth_id;

    const {
      full_name,
      bio,
      avatar,
      location,
      social_links,
      username,
      is_profile_public,
    } = req?.body;

    // Check username uniqueness if provided
    if (username) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .neq("auth_id", authId)
        .single();

      if (existing) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        name: full_name,
        bio,
        avatar,
        location,
        username,
        social_links,
        is_profile_public,
        last_active_at: new Date().toISOString(),
      })
      .eq("auth_id", authId)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Profile updated successfully", user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { error } = await req?.supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
