import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  patchBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { checkPermission } from "../helpers/checkPermission.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();
router.use(express.json());

// Async error handler wrapper
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

// Blog Routes
router.post("/blog", wrap(createBlog));
router.get("/blog", verifyToken, checkPermission, wrap(getAllBlogs));
router.get("/blog/:id", wrap(getBlogById));
router.put("/blog/:id", wrap(updateBlog));
router.patch("/blog/:id", wrap(patchBlog));
router.delete("/blog/:id", wrap(deleteBlog));

export default router;
