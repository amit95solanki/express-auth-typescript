import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Permission } from "../models/permission.js";

export const getUserPermissionHelper = async (user_id) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 0,

          permissions: {
            $cond: {
              if: { $isArray: "$permissions" },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: [null],
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permission: "$permissions.permission",
          },
        },
      },
    ]);
    return user[0];
  } catch (error) {
    // Handle the unknown type error
    if (error instanceof Error) {
      console.error(`Error getting user permission: ${error.message}`);
    } else {
      console.error(`Error getting user permission: ${String(error)}`);
    }
  }
};

export const getrouterPermission = async (router, role) => {
  try {
    const routerPermission = await Permission.findOne({
      router_endpoint: router,
      role: role,
    }).populate("permission_id");

    return routerPermission;
  } catch (error) {
    console.error(`Error getting router permission: ${error.message}`);
    return [];
  }
};
