import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  patchBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();
router.use(express.json());

// Async error handler wrapper
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

// Blog Routes
router.post("/", wrap(createBlog));
router.get("/", wrap(getAllBlogs));
router.get("/:id", wrap(getBlogById));
router.put("/:id", wrap(updateBlog));
router.patch("/:id", wrap(patchBlog));
router.delete("/:id", wrap(deleteBlog));

export default router;
