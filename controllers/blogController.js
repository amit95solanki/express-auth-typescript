import { Blog } from "../models/blog.js";

// Create Blog
export const createBlog = async (req, res) => {
  const {
    title,
    description,
    content,
    category,
    author_name,
    bio,
    date,
    tags,
    imageUrl,
    avatar,
  } = req.body;

  const blog = new Blog({
    title,
    description,
    content,
    category,
    date,
    tags,
    imageUrl,
    avatar,
    author_name,
    bio,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
};

// Get All Blogs (with search, category filter, pagination)
export const getAllBlogs = async (req, res) => {
  const { search = "", category = "All", page = 1, limit = 6 } = req.query;
  const query = {};

  if (search) {
    // List of string fields to search in Blog model
    const searchableFields = [
      "title",
      "description",
      "content",
      "category",
      "author_name",
      "bio",
      "tags",
    ];

    query.$or = searchableFields.map((field) => {
      // Handle tags as an array field
      if (field === "tags") {
        return { tags: { $in: [new RegExp(search, "i")] } };
      }
      return { [field]: { $regex: search, $options: "i" } };
    });
  }

  if (category !== "All") {
    query.category = category;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    blogs,
  });
};

// Get Blog by ID
export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

// Full Update (PUT)
export const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  Object.assign(blog, req.body);
  const updated = await blog.save();
  res.json(updated);
};

// Partial Update (PATCH)
export const patchBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  for (const [key, value] of Object.entries(req.body)) {
    blog[key] =
      key === "author" && typeof value === "string" ? JSON.parse(value) : value;
  }

  const updated = await blog.save();
  res.json(updated);
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  const deleted = await Blog.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Blog not found" });
  res.json({ message: "Blog deleted successfully" });
};
