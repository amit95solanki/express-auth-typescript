import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  permission_name: {
    type: String,
    required: true,
  },
  is_default: {
    type: Number,
    default: 0, // 0 not default / 1 for default permission
  },
});
export const Permission = mongoose.model("Permission", permissionSchema);
