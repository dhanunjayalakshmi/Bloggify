const supabaseBase = require("../config/supabaseClient");

const { createClient } = require("@supabase/supabase-js");

const verifyToken = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token Provided" });
    }

    const { data, error } = await supabaseBase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { data: userData, error: userError } = await supabaseBase
      .from("users")
      .select("id")
      .eq("auth_id", data?.user?.id)
      .single();

    if (userError || !userData) {
      return res.status(400).json({ error: "User not found in database" });
    }

    req.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { verifyToken };
