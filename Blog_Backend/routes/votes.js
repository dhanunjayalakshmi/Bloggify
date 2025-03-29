const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabaseClient");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Votin API
router.post("/", verifyToken, async (req, res) => {
  try {
    const { content_id, content_type, vote_type } = req?.body;
    const userId = req?.user?.id;

    const { data: existingVote, error: fetchError } = await supabase
      .from("votes")
      .select("id, vote_type")
      .eq("user_id", userId)
      .eq("content_id", content_id)
      .eq("content_type", content_type)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existingVote) {
      if (existingVote?.vote_type === vote_type) {
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) throw deleteError;
        return res.status(200).json({ message: "Vote has been removed" });
      } else {
        const { error: updateError } = await supabase
          .from("votes")
          .update({ vote_type })
          .eq("id", existingVote.id);

        if (updateError) throw updateError;
        return res
          .status(200)
          .json({ message: `Vote has been updated to ${vote_type}` });
      }
    }

    const { error: insertError } = await supabase
      .from("votes")
      .insert({ user_id: userId, content_id, content_type, vote_type });

    if (insertError) throw insertError;
    res.status(200).json({ message: "Vote added successfully" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Votes count
router.get("/count", verifyToken, async (req, res) => {
  try {
    const { content_id, content_type } = req?.query;
    const userId = req?.user ? req?.user?.id : null;

    if (!content_id || !content_type) {
      return res
        .status(400)
        .json({ error: "Missing content_id or content_type" });
    }

    const { data: votesData, error: fetchError } = await supabase
      .from("votes")
      .select("vote_type", { count: "exact" })
      .eq("content_id", content_id)
      .eq("content_type", content_type);

    if (fetchError) throw fetchError;

    const upvotes = votesData?.filter((vote) => vote?.vote_type === "upvote");

    const downvotes = votesData?.filter(
      (vote) => vote?.vote_type === "downvote"
    );

    const total_upvotes = upvotes?.length;
    const total_downvotes = downvotes?.length;

    let user_vote = null;
    if (userId) {
      const { data: userVoteData, error: userVoteError } = await supabase
        .from("votes")
        .select("vote_type")
        .eq("content_id", content_id)
        .eq("content_type", content_type)
        .eq("user_id", userId)
        .single();

      if (userVoteError) throw userVoteError;

      if (userVoteData) {
        user_vote = userVoteData?.vote_type;
      }
    }

    res.status(200).json({ total_upvotes, total_downvotes, user_vote });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = router;
