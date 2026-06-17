require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const blogsRoutes = require("./routes/blogs");
const commentsRoutes = require("./routes/comments");
const votesRoutes = require("./routes/votes");
const bookmarksRoutes = require("./routes/bookmarks");
const followsRoutes = require("./routes/follows");
const reportsRoutes = require("./routes/reports");
const dashboardRoutes = require("./routes/dashboard");
const notificationsRoutes = require("./routes/notifications");
const reactionsRoutes = require("./routes/reactions");
const tagFollowsRoutes = require("./routes/tagFollows");
const seriesRoutes = require("./routes/series");
const publicStatsRoutes = require("./routes/publicStats");
const supabaseAdmin = require("./config/supabaseAdmin");

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/follows", followsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reactions", reactionsRoutes);
app.use("/api/tag-follows", tagFollowsRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/public", publicStatsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Publish scheduled blogs every 60 seconds
  setInterval(async () => {
    const { error } = await supabaseAdmin
      .from("blogs")
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
        scheduled_at: null,
      })
      .lte("scheduled_at", new Date().toISOString())
      .eq("is_published", false)
      .not("scheduled_at", "is", null);

    if (error) console.error("Scheduled publish job error:", error.message);
  }, 60 * 1000);
});
