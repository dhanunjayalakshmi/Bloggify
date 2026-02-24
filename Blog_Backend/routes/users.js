const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//Fetch User Profile
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req?.params;
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("auth_id", id)
//       .single();

//     if (error) throw error;

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error?.message });
//   }
// });

// Get Self Profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const supabase = req?.supabase;
    const authId = req?.user?.id;

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
      { count: total_upvotes },
    ] = await Promise?.all([
      supabase
        .from("blogs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_published", true),

      supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id),

      supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("vote_type", "upvote"),
    ]);

    res.json({
      id: user?.id,
      username: user?.username,
      full_name: user?.name,
      avatar: user?.avatar,
      bio: user?.bio,
      location: user?.location,
      social_links: {
        website: user?.website,
        github: user?.github,
        linkedin: user?.linkedin,
        twitter: user?.twitter,
        instagram: user?.instagram,
      },
      stats: {
        blogs_published: blogs_published || 0,
        followers: 0, // future
        following: 0, // future
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

//Save user details after Signup
router.post("/", async (req, res) => {
  try {
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
    const authId = req?.user?.id;

    const {
      full_name,
      bio,
      avatar,
      location,
      website,
      github,
      linkedin,
      twitter,
      instagram,
      username,
    } = req.body;

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
        website,
        github,
        linkedin,
        twitter,
        instagram,
        username,
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

// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req?.params;
//     const { name, bio, avatar } = req?.body;

//     console.log(id, name, bio, avatar);

//     const { data, error } = await supabase
//       .from("users")
//       .update({ name, bio, avatar })
//       .eq("auth_id", id)
//       .select();

//     if (error) throw error;

//     res.json({ message: "Profile updated successfully", user: data });
//   } catch (error) {
//     res.status(500).json({ error: error?.message });
//   }
// });

module.exports = router;
