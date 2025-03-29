const express = require("express");
const supabase = require("../config/supabaseClient");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a comment
router.post("/", verifyToken, async (req, res) => {
  try {
    const { blog_id, content, parent_id } = req?.body;
    const user_id = req?.user?.id;

    const { data, error } = await supabase
      .from("comments")
      .insert([{ blog_id, user_id, content, parent_id }])
      .select();

    if (error) throw error;

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Get comments for a blog
router.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req?.params;
    const { page = 1, limit = 10 } = req?.query;
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from("comments")
      .select("*, users(name)")
      .eq("blog_id", blogId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.status(200).json({ comments: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Get replies for a comment
router.get("/:blogId/replies/:commentId", async (req, res) => {
  try {
    const { blogId, commentId } = req?.params;
    const { page = 1, limit = 5 } = req?.query;
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from("comments")
      .select("*, users(name)")
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

    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (!comment || comment.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
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

    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (!comment || comment.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
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
