const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let blogs = [
  {
    id: 1,
    title: "Welcome Blog",
    content: "This is the first blog."
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to Data Hub API");
});

app.get("/blogs", (req, res) => {
  res.json(blogs);
});
app.get("/blogs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  res.json(blog);
});
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  const newBlog = {
    id: blogs.length + 1,
    title,
    content,
  };

  blogs.push(newBlog);

  res.status(201).json({
    message: "Blog created successfully",
    blog: newBlog,
  });
});

app.put("/blogs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  blog.title = title;
  blog.content = content;

  res.json({
    message: "Blog updated successfully",
    blog,
  });
});
app.delete("/blogs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const blogIndex = blogs.findIndex((b) => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({
      message: "Blog not found",
    });
  }

  blogs.splice(blogIndex, 1);

  res.json({
    message: "Blog deleted successfully",
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "admin@example.com" &&
    password === "123456"
  ) {
    return res.json({
      success: true,
      message: "Login successful",
      token: "mock-jwt-token-123456"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});