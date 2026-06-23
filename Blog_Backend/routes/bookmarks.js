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

    const { data: existingBookmark, error: fetchError } = await req?.supabase
      .from("bookmarks")
      .select("id")
      .eq("blog_id", blog_id)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingBookmark) {
      const { error: deleteError } = await req?.supabase
        .from("bookmarks")
        .delete()
        .eq("id", existingBookmark.id);

      if (deleteError) throw deleteError;
      return res.status(200).json({ message: "Bookmark removed" });
    }

    const { error: insertError } = await req?.supabase
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

    const { data, error } = await req?.supabase
      .from("bookmarks")
      .select("blog_id, created_at")
      .eq("user_id", userId);

    if (error) throw error;
    res.status(200).json({ bookmarks: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookmarked blogs with details
router.get("/blogs", verifyToken, async (req, res) => {
  try {
    const userId = req?.user?.id;

    // Step 1: get bookmark rows (simple select, no join — avoids FK requirement)
    const { data: bookmarkRows, error: bookmarkError } = await req?.supabase
      .from("bookmarks")
      .select("blog_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (bookmarkError) throw bookmarkError;
    if (!bookmarkRows?.length) return res.status(200).json({ blogs: [] });

    const blogIds = bookmarkRows.map((b) => b.blog_id);
    const bookmarkedAtMap = Object.fromEntries(
      bookmarkRows.map((b) => [b.blog_id, b.created_at])
    );

    // Step 2: fetch blog details with author
    const { data: blogsData, error: blogsError } = await req?.supabase
      .from("blogs")
      .select("id, title, read_time, content, cover_image, tags, views, users(name, avatar)")
      .in("id", blogIds);

    if (blogsError) throw blogsError;

    // Re-sort to match bookmark order
    const blogs = blogIds
      .map((id) => {
        const blog = blogsData?.find((b) => b.id === id);
        return blog ? { ...blog, bookmarked_at: bookmarkedAtMap[id], isBookmarked: true } : null;
      })
      .filter(Boolean);

    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
