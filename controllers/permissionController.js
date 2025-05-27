import { validationResult } from "express-validator";
import { Permission } from "../models/permission.js";
import { log } from "console";
export const addPermission = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Errors ", errors: error.array() });
    }

    const { permission_name } = req.body;

    const permission = await Permission.findOne({
      permission_name: permission_name,
    });

    if (permission) {
      return res.status(400).json({
        status: false,
        message: "Permission already exists",
      });
    }
    const obj = {
      permission_name,
    };

    if (req.body.is_default) {
      obj.is_default = parseInt(req.body.is_default);
    }

    const newPermission = new Permission(obj);
    const savedPermission = await newPermission.save();
    return res.status(200).json({
      status: true,
      message: "Permission added successfully",
      data: savedPermission,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPermission = async (req, res) => {
  try {
    const permissions = await Permission.find();
    if (!permissions) {
      return res.status(404).json({
        status: false,
        message: "No permissions found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Permissions retrieved successfully",
      data: permissions,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Errors ", errors: error.array() });
    }
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Permission ID is required",
      });
    }

    const permission = await Permission.findByIdAndDelete({ _id: id });

    if (!permission) {
      return res.status(404).json({
        status: false,
        message: "Permission not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const editPermission = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Errors ", errors: error.array() });
    }
    const { id, permission_name } = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Permission ID is required",
      });
    }

    const exist = await Permission.findOne({ _id: id });
    if (!exist) {
      return res.status(404).json({
        status: false,
        message: "Permission not found",
      });
    }

    const isNameAssigned = await Permission.findOne({
      _id: { $ne: id },
      permission_name: permission_name,
    });

    if (isNameAssigned) {
      return res.status(400).json({
        status: false,
        message: "Permission name already exists",
      });
    }

    const updatePermission = {
      permission_name,
    };

    if (req.body.is_default !== null) {
      updatePermission.is_default = parseInt(req.body.is_default);
    }

    const permission = await Permission.findByIdAndUpdate(
      { _id: id },
      { $set: updatePermission },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Permission updated successfully",
      data: permission,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
