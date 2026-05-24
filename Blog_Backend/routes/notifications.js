const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Get notifications for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));

    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        id,
        type,
        is_read,
        created_at,
        blog_id,
        comment_id,
        actor:users!notifications_actor_id_fkey (
          id,
          name,
          username,
          avatar
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const unreadCount = data?.filter((n) => !n.is_read).length || 0;

    res.json({ notifications: data || [], unreadCount });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read
router.patch("/read-all", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Mark a single notification as read
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark single read error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
