const express = require("express");
const supabase = require("../config/supabaseClient");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Follow/Unfollow a user
router.post("/", verifyToken, async (req, res) => {
  try {
    const { following_id } = req?.body;
    const follower_id = req?.user?.id;

    if (!following_id) {
      return res.status(400).json({ error: "Missing following id" });
    }

    const { data: existingFollower, error: fetchError } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", follower_id)
      .eq("following_id", following_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existingFollower) {
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("id", existingFollower.id);

      if (deleteError) throw deleteError;

      return res.status(200).json({ message: "Unfollowed successfully" });
    }

    const { error: insertError } = await supabase
      .from("follows")
      .insert([{ follower_id, following_id }]);

    if (insertError) throw insertError;

    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Followers of a User
router.get("/followers/:userId", async (req, res) => {
  try {
    const { userId } = req?.params;

    const { data, error } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", userId);

    if (error) throw error;

    res.status(200).json({ followers: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Following List of a User
router.get("/following/:userId", async (req, res) => {
  try {
    const { userId } = req?.params;

    const { data, error } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (error) throw error;

    res.status(200).json({ following: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if User is Following Another User
router.get("/is-following", verifyToken, async (req, res) => {
  try {
    const { following_id } = req?.query;
    const follower_id = req?.user?.id;

    if (!following_id) {
      return res.status(400).json({ error: "Missing following_id" });
    }

    const { data, error } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", follower_id)
      .eq("following_id", following_id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.status(200).json({ is_following: !!data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
