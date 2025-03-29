const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabaseClient");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Adding and deleting bookmark for a blog
router.post("/", verifyToken, async (req, res) => {
  try {
    const { blog_id } = req?.body;
    const userId = req?.user?.id;

    if (!blog_id) {
      return res.status(400).json({ error: "Missing blog id" });
    }

    const { data: existingBookmark, error: fetchError } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("blog_id", blog_id)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingBookmark) {
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", existingBookmark.id);

      if (deleteError) throw deleteError;
      return res.status(200).json({ message: "Bookmark removed" });
    }

    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert([{ user_id: userId, blog_id }]);

    if (insertError) throw insertError;

    res.status(201).json({ message: "Bookmark added" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Get all bookmarks of a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req?.user?.id;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("blog_id, created_at")
      .eq("user_id", userId);

    if (error) throw error;
    res.status(200).json({ bookmarks: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
