require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const blogsRoutes = require("./routes/blogs");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/blogs", blogsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
