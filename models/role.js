import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0, // 0 not default / 1 for default permission
  },
});
export const Role = mongoose.model("Role", roleSchema);
