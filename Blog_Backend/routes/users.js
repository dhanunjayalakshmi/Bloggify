const express = require("express");
const supabase = require("../config/supabaseClient");

const router = express.Router();

//Fetch User Profile
router.get("/:id", async (req, res) => {
  try {
    const { id } = req?.params;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//Save user details after Signup
router.post("/", async (req, res) => {
  try {
    const { id, email, name = "New User", bio = "", avatar = "" } = req?.body;
    
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingUser) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ name, bio, avatar })
        .eq("auth_id", id);

      if (updateError) throw updateError;

      return res.json({ message: "User details updated successfully" });
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert({ auth_id: id, name, email, bio, avatar });

    if (insertError) throw insertError;

    res.json({ message: "User created Successfully" });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

//Update User Profile
router.put("/:id", async (req, res) => {
  try {
    const { id } = req?.params;
    const { name, bio, avatar } = req?.body;

    console.log(id, name, bio, avatar);

    const { data, error } = await supabase
      .from("users")
      .update({ name, bio, avatar })
      .eq("auth_id", id)
      .select();

    if (error) throw error;

    res.json({ message: "Profile updated successfully", user: data });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = router;
