const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({ access_token: data.session.access_token, user: data.user });
});

router.post("/logout", async (req, res) => {
  const { access_token } = req.body; // Token received during login

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(500).json({ error: "Logout failed" });
  }

  res.json({ message: "Logged out successfully" });
});

module.exports = router;
