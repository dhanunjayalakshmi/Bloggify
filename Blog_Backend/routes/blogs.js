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
    let { page, limit, search, sort, tags } = req?.query;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .eq("is_published", true);

    if (search) {
      query = query.or(
        `title.ilike.%${search.toLowerCase()}%, content.ilike.%${search.toLowerCase()}%`
      );
    }

    if (tags) {
      const tagsArray = tags.includes(",") ? tags.split(",") : [tags];
      const tagsLowerCase = tagsArray.map((tag) => tag.toLowerCase());
      query = query.contains("tags", tagsLowerCase);
    }

    if (sort === "newest") {
      query = query.order("published_at", { ascending: false });
    } else if (sort === "oldest") {
      query = query.order("published_at", { ascending: true });
    } else if (sort === "read_time") {
      query = query.order("read_time", { ascending: true });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      blogs: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Create new blog
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const user = req?.user;

    if (!user) return res.status(401).json({ error: "Unautorized!!" });

    const auth_id = user?.id;
    const { title, content, tags, read_time, is_published, is_public } =
      req?.body;

    const file = req?.file;

    const { validationError } = validateBlog(title, content);
    if (validationError) {
      return res.status(400).json({ validationError });
    }

    const imageUrl = await uploadImage(file);

    const { data, dbError } = await supabase
      .from("blogs")
      .insert({
        title,
        content,
        tags: tags ? tags.split(",") : [],
        read_time: read_time ? parseInt(read_time) : null,
        cover_image: imageUrl,
        user_id: auth_id,
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
        is_public,
      })
      .select();

    console.log("DB error:  ", dbError);

    if (dbError) throw dbError;
    res.status(201).json({ message: "Blog created Successfully", blog: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = router;
