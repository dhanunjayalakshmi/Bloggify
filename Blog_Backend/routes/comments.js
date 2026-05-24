const express = require("express");
const supabase = require("../config/supabaseClient");
const { verifyToken } = require("../middlewares/authMiddleware");
const { createNotification } = require("../utils/notificationHelpers");

const router = express.Router();

// Create a comment
router.post("/", verifyToken, async (req, res) => {
  try {
    const { blog_id, content, parent_id } = req?.body;
    const user_id = req?.user?.id;

    const { data, error } = await req?.supabase
      .from("comments")
      .insert([{ blog_id, user_id, content, parent_id }])
      .select()
      .single();

    if (error) throw error;

    if (parent_id) {
      const { data: parentComment } = await req.supabase
        .from("comments")
        .select("user_id")
        .eq("id", parent_id)
        .single();

      if (parentComment) {
        await createNotification(req.supabase, {
          userId: parentComment.user_id,
          actorId: user_id,
          type: "comment_reply",
          blogId: blog_id,
          commentId: data.id,
        });
      }
    } else {
      const { data: blog } = await req.supabase
        .from("blogs")
        .select("user_id")
        .eq("id", blog_id)
        .single();

      if (blog) {
        await createNotification(req.supabase, {
          userId: blog.user_id,
          actorId: user_id,
          type: "new_comment",
          blogId: blog_id,
          commentId: data.id,
        });
      }
    }

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Getting comments counts of blogs in bulk
router.get("/counts", verifyToken, async (req, res) => {
  try {
    const { blogIds } = req?.query;
    if (!blogIds) return res.status(400).json({ error: "Missing blogIds" });

    const ids = typeof blogIds === "string" ? blogIds?.split(",") : blogIds;

    const { data, error } = await req?.supabase
      .from("comments")
      .select("blog_id", { count: "exact" })
      .in("blog_id", ids);

    if (error) throw error;

    const countsMap = {};
    data?.forEach((comment) => {
      countsMap[comment?.blog_id] = (countsMap[comment?.blog_id] || 0) + 1;
    });

    const result = ids?.map((id) => ({
      blog_id: id,
      count: countsMap[id] || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a blog
router.get("/:blogId", verifyToken, async (req, res) => {
  try {
    const { blogId } = req?.params;
    const { page = 1, limit = 10 } = req?.query;
    const offset = (page - 1) * limit;

    const { data, error } = await req?.supabase
      .from("comments")
      .select("*, users(name, avatar)")
      .eq("blog_id", blogId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    if (!data?.length) {
      return res.status(200).json({ comments: [] });
    }

    // Batch-fetch reply counts for all returned comments in one query
    const commentIds = data.map((c) => c.id);
    const { data: replyRows, error: replyError } = await req?.supabase
      .from("comments")
      .select("parent_id")
      .in("parent_id", commentIds);

    if (replyError) throw replyError;

    const replyCountMap = {};
    replyRows?.forEach((r) => {
      replyCountMap[r.parent_id] = (replyCountMap[r.parent_id] || 0) + 1;
    });

    const comments = data.map((c) => ({
      ...c,
      reply_count: replyCountMap[c.id] || 0,
    }));

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Get replies for a comment
router.get("/:blogId/replies/:commentId", verifyToken, async (req, res) => {
  try {
    const { blogId, commentId } = req?.params;
    const { page = 1, limit = 5 } = req?.query;
    const offset = (page - 1) * limit;

    const { data, error } = await req?.supabase
      .from("comments")
      .select("*, users(name, avatar)")
      .eq("parent_id", commentId)
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.status(200).json({ replies: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Edit a comment
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req?.params;
    const { content } = req?.body;
    const userId = req?.user?.id;

    const { data: comment, error: fetchError } = await req?.supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (!comment || comment.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await req?.supabase
      .from("comments")
      .update({ content })
      .eq("id", id)
      .select();

    if (error) throw error;
    res
      .status(200)
      .json({ message: "Comment has been updated", comment: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//Delete a comment and its replies
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req?.params;
    const userId = req?.user?.id;

    const { data: comment, error: fetchError } = await req?.supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (!comment || comment.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await req?.supabase
      .from("comments")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    res.status(200).json({ message: "Comment has been deleted" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
module.exports = router;
