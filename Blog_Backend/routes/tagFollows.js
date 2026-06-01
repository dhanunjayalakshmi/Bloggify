const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Get followed tags for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("tag_follows")
      .select("tag, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ tags: data?.map((r) => r.tag) || [] });
  } catch (err) {
    console.error("Get tag follows error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Toggle follow/unfollow a tag
router.post("/", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { tag } = req.body;

    if (!tag || typeof tag !== "string") {
      return res.status(400).json({ error: "Invalid tag" });
    }

    const normalizedTag = tag.trim().toLowerCase();

    const { data: existing, error: fetchError } = await supabase
      .from("tag_follows")
      .select("id")
      .eq("user_id", userId)
      .eq("tag", normalizedTag)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existing) {
      const { error: deleteError } = await supabase
        .from("tag_follows")
        .delete()
        .eq("id", existing.id);

      if (deleteError) throw deleteError;
      return res.json({ following: false, tag: normalizedTag });
    }

    const { error: insertError } = await supabase
      .from("tag_follows")
      .insert({ user_id: userId, tag: normalizedTag });

    if (insertError) throw insertError;
    res.json({ following: true, tag: normalizedTag });
  } catch (err) {
    console.error("Toggle tag follow error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
