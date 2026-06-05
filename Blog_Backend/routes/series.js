const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Get series a blog belongs to (for BlogDetails widget)
router.get("/blog/:blogId", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const { blogId } = req.params;

    const { data: seriesBlog, error: sbError } = await supabase
      .from("series_blogs")
      .select("series_id, order_index")
      .eq("blog_id", blogId)
      .single();

    if (sbError || !seriesBlog) return res.json({ series: null });

    const { data: series, error: sError } = await supabase
      .from("series")
      .select("id, title, description")
      .eq("id", seriesBlog.series_id)
      .single();

    if (sError || !series) return res.json({ series: null });

    const { data: blogs, error: bError } = await supabase
      .from("series_blogs")
      .select("order_index, blog_id, blogs(id, title, is_published)")
      .eq("series_id", series.id)
      .order("order_index", { ascending: true });

    if (bError) throw bError;

    const parts = blogs
      .filter((b) => b.blogs?.is_published)
      .map((b) => ({
        blogId: b.blog_id,
        title: b.blogs?.title,
        order: b.order_index,
        isCurrent: b.blog_id === blogId,
      }));

    res.json({ series: { ...series, currentOrder: seriesBlog.order_index, parts } });
  } catch (err) {
    console.error("Get series for blog error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all series owned by logged-in user
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("series")
      .select(`
        id, title, description, created_at,
        series_blogs (
          order_index,
          blog_id,
          blogs ( id, title, is_published )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const result = (data || []).map((s) => ({
      ...s,
      blogs: (s.series_blogs || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map((sb) => ({
          blogId: sb.blog_id,
          title: sb.blogs?.title,
          isPublished: sb.blogs?.is_published,
          order: sb.order_index,
        })),
      series_blogs: undefined,
    }));

    res.json({ series: result });
  } catch (err) {
    console.error("Get my series error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a series
router.post("/", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const { data, error } = await supabase
      .from("series")
      .insert({ user_id: userId, title: title.trim(), description: description?.trim() || null })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ series: data });
  } catch (err) {
    console.error("Create series error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update series title/description
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description } = req.body;

    const { data: existing } = await supabase
      .from("series")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data, error } = await supabase
      .from("series")
      .update({ title: title?.trim(), description: description?.trim() || null })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ series: data });
  } catch (err) {
    console.error("Update series error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a series
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id } = req.params;

    const { data: existing } = await supabase
      .from("series")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase.from("series").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Series deleted" });
  } catch (err) {
    console.error("Delete series error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a blog to a series
router.post("/:id/blogs", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id } = req.params;
    const { blog_id, order_index } = req.body;

    const { data: series } = await supabase
      .from("series")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!series || series.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("series_blogs")
      .insert({ series_id: id, blog_id, order_index: order_index ?? 0 });

    if (error) throw error;
    res.status(201).json({ message: "Blog added to series" });
  } catch (err) {
    console.error("Add blog to series error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Reorder blogs in a series
router.patch("/:id/blogs/reorder", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id } = req.params;
    const { order } = req.body; // [{ blogId, orderIndex }, ...]

    const { data: series } = await supabase
      .from("series")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!series || series.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Promise.all(
      order.map(({ blogId, orderIndex }) =>
        supabase
          .from("series_blogs")
          .update({ order_index: orderIndex })
          .eq("series_id", id)
          .eq("blog_id", blogId),
      ),
    );

    res.json({ message: "Order updated" });
  } catch (err) {
    console.error("Reorder series error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Remove a blog from a series
router.delete("/:id/blogs/:blogId", verifyToken, async (req, res) => {
  try {
    const supabase = req.supabase;
    const userId = req.user.id;
    const { id, blogId } = req.params;

    const { data: series } = await supabase
      .from("series")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!series || series.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("series_blogs")
      .delete()
      .eq("series_id", id)
      .eq("blog_id", blogId);

    if (error) throw error;
    res.json({ message: "Blog removed from series" });
  } catch (err) {
    console.error("Remove blog from series error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
