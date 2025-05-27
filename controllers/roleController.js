import { Role } from "../models/role.js";
import { validationResult } from "express-validator";
export const storeRole = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Errors ", errors: error.array() });
    }

    const { role_name, value } = req.body;

    if (!role_name) {
      return res.status(400).json({
        status: false,
        message: "Role name and value are required",
      });
    }

    const newRole = new Role({
      role_name,
      value,
    });

    await newRole.save();

    return res.status(201).json({
      status: true,
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRole = async (req, res) => {
  try {
    const roles = await Role.find({ value: { $ne: 1 } }); // Exclude roles with value 1 admin

    if (roles.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No roles found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Roles retrieved successfully",
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
