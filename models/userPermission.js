import mongoose from "mongoose";

const userPermissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permission: [
      {
        permission_name: {
          type: String,
          required: true,
        },
        permission_value: {
          type: [Number],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserPermission = mongoose.model(
  "UserPermission",
  userPermissionSchema
);
