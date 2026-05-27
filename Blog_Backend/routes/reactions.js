const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

const VALID_EMOJIS = ["❤️", "🔥", "💡", "🤔", "🎉"];

// Get reactions for a blog
router.get("/:blogId", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const { blogId } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("reactions")
      .select("emoji, user_id")
      .eq("blog_id", blogId);

    if (error) throw error;

    const counts = {};
    const userReactions = new Set();

    VALID_EMOJIS.forEach((e) => (counts[e] = 0));

    data?.forEach((r) => {
      if (counts[r.emoji] !== undefined) counts[r.emoji]++;
      if (r.user_id === userId) userReactions.add(r.emoji);
    });

    res.json({ counts, userReactions: [...userReactions] });
  } catch (err) {
    console.error("Get reactions error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Toggle a reaction
router.post("/", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const { blog_id, emoji } = req.body;
    const userId = req.user.id;

    if (!VALID_EMOJIS.includes(emoji)) {
      return res.status(400).json({ error: "Invalid emoji" });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("reactions")
      .select("id")
      .eq("blog_id", blog_id)
      .eq("user_id", userId)
      .eq("emoji", emoji)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existing) {
      const { error: deleteError } = await supabase
        .from("reactions")
        .delete()
        .eq("id", existing.id);

      if (deleteError) throw deleteError;
      return res.json({ reacted: false, emoji });
    }

    const { error: insertError } = await supabase
      .from("reactions")
      .insert({ blog_id, user_id: userId, emoji });

    if (insertError) throw insertError;
    res.json({ reacted: true, emoji });
  } catch (err) {
    console.error("Toggle reaction error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
