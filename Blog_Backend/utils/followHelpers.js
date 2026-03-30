const attachFollowState = async (supabase, currentUserId, users = []) => {
  if (!users?.length) return [];

  const ids = users.map((user) => user.id);

  const { data: followRows, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUserId)
    .in("following_id", ids);

  if (error) throw error;

  const followSet = new Set((followRows || []).map((row) => row.following_id));

  return users.map((user) => ({
    ...user,
    is_following: followSet.has(user.id),
  }));
};

module.exports = { attachFollowState };
