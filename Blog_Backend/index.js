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

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/blogs", blogsRoutes);
app.use("/comments", commentsRoutes);
app.use("/votes", votesRoutes);
app.use("/bookmarks", bookmarksRoutes);
app.use("/follows", followsRoutes);
app.use("/reports", reportsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
