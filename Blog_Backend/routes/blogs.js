const express = require("express");
const supabaseClient = require("../config/supabaseClient");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user } = await supabase.auth.getUser();

    if (!user) return res.status(401).json({ error: "Unautorised!!" });

    const auth_id = user?.id;
    const { title, content, tags, cover_image, is_published } = req?.body;

    const { data, dbError } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          content,
          tags,
          cover_image,
          user_id: auth_id,
          published_at: is_published ? new Date().toISOString() : null,
        },
      ])
      .select();

    if (dbError) throw dbError;
    res
      .status(201)
      .json({ message: "Blog created Successfully", blog: data[0] });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});
