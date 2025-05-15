import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import blogRoute from "./routes/blogRoute.js";
dotenv.config();
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "", {
      dbName: "auth",
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

const port = process.env.PORT || 3000;
app.use("/api", userRoute);
app.use("/blog", blogRoute);
app.use("/", authRoute);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
