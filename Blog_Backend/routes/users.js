const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get Self Profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const authId = req?.user?.auth_id;

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
      { count: total_comments },
      { count: followers },
      { count: following },
    ] = await Promise?.all([
      supabase
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_published", true),

      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

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
      .eq("is_published", true);

    if (blogsError) throw blogsError;

    const blogIds = userBlogs?.map((b) => b.id) || [];

    let total_upvotes = 0;

    if (blogIds.length > 0) {
      const { count, error: votesError } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .in("content_id", blogIds)
        .eq("content_type", "blog")
        .eq("vote_type", "upvote");

      if (votesError) throw votesError;

      total_upvotes = count || 0;
    }

    res.json({
      id: user?.id,
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

// Get Profile Suggestions
router.get("/suggestions", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    // Get users with published blogs count
    const { data, error } = await supabase
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
      .neq("id", currentUserId)
      .limit(limit);

    if (error) throw error;

    // Optional: sort by blog count descending
    const sorted = data.sort(
      (a, b) => (b.blogs?.length || 0) - (a.blogs?.length || 0),
    );

    res.json({ users: sorted });
  } catch (err) {
    console.error("Profile suggestions error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Author Public Profile
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const { userId } = req?.params;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [
      { count: blogs_published },
      { count: total_comments },
      { count: followers },
      { count: following },
    ] = await Promise?.all([
      supabase
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_published", true),

      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

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
      .eq("is_published", true);

    if (blogsError) throw blogsError;

    const blogIds = userBlogs?.map((b) => b.id) || [];

    let total_upvotes = 0;

    if (blogIds.length > 0) {
      const { count, error: votesError } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .in("content_id", blogIds)
        .eq("content_type", "blog")
        .eq("vote_type", "upvote");

      if (votesError) throw votesError;

      total_upvotes = count || 0;
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
    let { page = 1, limit = 5 } = req.query;

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

    const { full_name, bio, avatar, location, social_links, username } =
      req?.body;

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
        location,
        username,
        social_links,
        last_active_at: new Date(),
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

module.exports = router;
