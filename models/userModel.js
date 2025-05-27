import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    // required: true,
  },
  countryCode: {
    type: String,
    // required: true,
  },

  password: {
    type: String,
    // required: true,
  },
  is_verified: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
    default: "0",
  },
  role: {
    type: Number,
    default: 0, // 0 for user, 1 for admin, 2 for sub admin,3 for editor
  },
});
export const User = mongoose.model("User", userSchema);
