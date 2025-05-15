import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    category: { type: String },
    date: { type: String }, // Consider `type: Date` for real dates
    tags: [{ type: String }],
    imageUrl: { type: String, required: true },
    avatar: { type: String, default: "0" },
    bio: { type: String },
    author_name: { type: String }, // Added field to match controller
  },
  { timestamps: true }
);

export const Blog = mongoose.model("BlogPost", BlogSchema);
