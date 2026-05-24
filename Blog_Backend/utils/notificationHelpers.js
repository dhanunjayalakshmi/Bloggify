const createNotification = async (supabase, { userId, actorId, type, blogId = null, commentId = null }) => {
  if (userId === actorId) return;

  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      actor_id: actorId,
      type,
      blog_id: blogId,
      comment_id: commentId,
    });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

module.exports = { createNotification };
