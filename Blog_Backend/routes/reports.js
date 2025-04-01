const express = require("express");
const supabase = require("../config/supabaseClient");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Report Blog/Comment
router.post("/", verifyToken, async (req, res) => {
  try {
    const { content_id, content_type, reason, status } = req?.body;
    const user_id = req?.user?.id;

    if (!content_id || !content_type || !reason || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: existingReport, error: fetchError } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", user_id)
      .eq("content_id", content_id)
      .eq("content_type", content_type)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existingReport) {
      return res
        .status(400)
        .json({ error: "You have already reported this content" });
    }

    const { error: insertError } = await supabase
      .from("reports")
      .insert([
        { reporter_id: user_id, content_id, content_type, reason, status },
      ]);

    if (insertError) throw insertError;

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Reports
router.get("/my-reports", verifyToken, async (req, res) => {
  try {
    const user_id = req?.user?.id;

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("reporter_id", user_id);

    if (error) throw error;

    res.status(200).json({ reports: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Reports (For admins)
router.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase.from("reports").select("*");

    if (error) throw error;

    res.status(200).json({ reports: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

// Delete a Report
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req?.params;
    const user_id = req?.user?.id;

    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id)
      .eq("reporter_id", user_id);

    if (error) throw error;
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = router;
