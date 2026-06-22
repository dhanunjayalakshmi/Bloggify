const supabaseBase = require("../config/supabaseClient");
const supabaseAdmin = require("../config/supabaseAdmin");
const { createClient } = require("@supabase/supabase-js");

const generateUsername = (authUser) => {
  const base = (
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    authUser.email?.split("@")[0] ||
    "user"
  )
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 15);
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `${base}${suffix}`;
};

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

    let { data: userData, error: userError } = await supabaseBase
      .from("users")
      .select("id, auth_id")
      .eq("auth_id", data?.user?.id)
      .single();

    // Auto-create profile for new OAuth users
    if (userError || !userData) {
      const authUser = data.user;
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          auth_id: authUser.id,
          email: authUser.email,
          name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "User",
          avatar: authUser.user_metadata?.avatar_url || null,
          username: generateUsername(authUser),
        })
        .select("id, auth_id")
        .single();

      if (createError || !newUser) {
        console.error("Failed to auto-create OAuth user:", createError?.message);
        return res.status(400).json({ error: "User not found in database" });
      }

      userData = newUser;
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
