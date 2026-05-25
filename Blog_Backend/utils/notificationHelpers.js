const createNotification = async (supabase, { userId, actorId, type, blogId = null, commentId = null }) => {
  if (userId === actorId) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    actor_id: actorId,
    type,
    blog_id: blogId,
    comment_id: commentId,
  });

  if (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = { createNotification };
