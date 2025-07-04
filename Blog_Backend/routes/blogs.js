const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabaseClient");
const { validateBlog } = require("../utils/validators");
const { uploadImage } = require("../utils/uploadImage");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    let { page, limit, search, sort, tags, authorId } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    const offset = (page - 1) * limit;

    // Get reported blog IDs
    const { data: reportedBlogs, error: reportError } = await supabase
      .from("reports")
      .select("content_id");

    if (reportError) throw reportError;

    const reportedIds = reportedBlogs?.map((r) => r.content_id) || [];

    // Base query
    let baseQuery = supabase
      .from("blogs")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    if (authorId) {
      baseQuery = baseQuery.eq("user_id", authorId);
    }

    if (search) {
      baseQuery = baseQuery.or(
        `title.ilike.%${search.toLowerCase()}%,content.ilike.%${search.toLowerCase()}%`
      );
    }

    if (tags) {
      const tagsArray = tags.includes(",") ? tags.split(",") : [tags];
      const tagsLowerCase = tagsArray.map((tag) => tag.toLowerCase());
      baseQuery = baseQuery.contains("tags", tagsLowerCase);
    }

    // Get total count of matching blogs
    const { count, error: countError } = await baseQuery;
    if (countError) throw countError;

    const totalPages = Math.ceil(count / limit);
    if (page > totalPages && totalPages !== 0) {
      return res.status(200).json({
        blogs: [],
        total: count,
        page,
        limit,
        totalPages,
      });
    }

    // Build query
    let query = supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .eq("is_published", true);

    if (authorId) query = query.eq("user_id", authorId);

    if (search) {
      const q = search.toLowerCase();
      query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
    }

    if (tags && tags !== "All Tags") {
      const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      query = query.contains("tags", tagsArray);
    }

    if (sort === "newest")
      query = query.order("published_at", { ascending: false });
    else if (sort === "oldest")
      query = query.order("published_at", { ascending: true });
    else if (sort === "read_time")
      query = query.order("read_time", { ascending: true });

    // Exclude reported blogs
    if (reportedIds.length > 0) {
      query = query.not("id", "in", `(${reportedIds.join(",")})`);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: blogs, error } = await query;
    if (error) throw error;

    res.status(200).json({
      blogs,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Fetch Blogs Error:", error?.message);
    res.status(500).json({ error: error?.message || "Server error" });
  }
});

//Get a single blog
router.get("/:blogId", verifyToken, async (req, res) => {
  try {
    const userId = req?.user?.id;
    const blogId = req?.params?.blogId;

    const { data: blog, error } = await supabase
      .from("blogs")
      .select(
        `
        *,
        users (
          name,
          avatar
        )
      `
      )
      .eq("id", blogId)
      .single();

    if (error || !blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (!blog?.is_published && (!userId || blog?.user_id !== userId)) {
      return res.status(404).json({ error: "Access denied" });
    }

    if (blog?.is_published && !blog?.is_public && !userId) {
      return res.status(403).json({ error: "Authentication required" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Create new blog
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const user = req?.user;

    if (!user) return res.status(401).json({ error: "Unautorized!!" });

    const user_id = user?.id;
    const {
      title,
      description,
      content,
      tags,
      read_time,
      is_published,
      is_public,
    } = req?.body;

    const file = req?.file;

    const { validationError } = validateBlog(title, content);
    if (validationError) {
      return res.status(400).json({ validationError });
    }

    const imageUrl = await uploadImage(file);

    const { data, error: insertError } = await req?.supabase
      .from("blogs")
      .insert({
        title,
        content,
        cover_image: imageUrl,
        tags: Array.isArray(tags) ? tags : String(tags).split(","),
        read_time: read_time ? parseInt(read_time) : null,
        user_id,
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
        is_public,
      })
      .select();

    if (insertError) throw insertError;

    res.status(201).json({ message: "Blog created Successfully", data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//Update the blog
router.put("/:blogId", verifyToken, async (req, res) => {
  try {
    const { blogId } = req?.params;
    const { title, content, tags, is_published, is_public, read_time } =
      req?.body;

    const userId = req?.user?.id;

    const { data: blog, error: fetchError } = await supabase
      .from("blogs")
      .select("user_id")
      .eq("id", blogId)
      .single();

    if (fetchError) throw fetchError;

    if (!blog || blog?.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title,
        content,
        tags,
        is_published,
        is_public,
        read_time,
      })
      .eq("id", blogId)
      .select();

    if (error) throw error;

    res.status(200).json({ message: "Blog updated successfully", blog: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//Delete the blog
router.delete("/:blogId", verifyToken, async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { blogId } = req?.params;

    const { data: blog, error: fetchError } = await supabase
      .from("blogs")
      .select("user_id, cover_image")
      .eq("id", blogId)
      .single();

    if (fetchError) throw fetchError;

    if (!blog || blog.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (blog.cover_image) {
      const imagePath = blog.cover_image.split("/").pop();
      const { error: storageError } = await supabase.storage
        .from("blog-images")
        .remove([imagePath]);

      if (storageError) throw storageError;
    }

    const { error: deleteError } = await supabase
      .from("blogs")
      .delete()
      .eq("id", blogId);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = router;
