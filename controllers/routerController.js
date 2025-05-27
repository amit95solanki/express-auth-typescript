import { validationResult } from "express-validator";
import { RouterPermission } from "../models/routerPermissionModel.js";
export const getAllRouter = async (req, res) => {
  try {
    const tempRoutes = [];
    const stack = req.app._router.stack;

    stack.forEach((data) => {
      // Fixed: Check if it's a router layer
      if (data.name === "router" && data.handle && data.handle.stack) {
        data.handle.stack.forEach((handler) => {
          if (handler.route) {
            tempRoutes.push({
              path: handler.route.path,
              method: Object.keys(handler.route.methods)[0].toUpperCase(), // Fixed: Get the HTTP method
            });
          }
        });
      }
      // Handle direct routes (not nested in router)
      else if (data.route) {
        tempRoutes.push({
          path: data.route.path,
          method: Object.keys(data.route.methods)[0].toUpperCase(),
        });
      }
    });

    return res.status(200).json({
      message: "All routers fetched successfully",
      data: tempRoutes,
    });
  } catch (error) {
    console.error("Error fetching all routers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addRouterPermission = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { router_endpoint, role, permission, permission_id } = req.body;

    // Validate required fields
    if (!router_endpoint || !role || !permission || !permission_id) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: router_endpoint, role, and permission are required",
      });
    }

    // Use findOneAndUpdate correctly (it's a method, not a constructor)
    const routerPermission = await RouterPermission.findOneAndUpdate(
      {
        router_endpoint,
        role,
      },
      {
        router_endpoint,
        role,
        permission,
        permission_id,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true, // Fixed typo: was 'setDefaultIns'
      }
    );

    return res.status(200).json({
      success: true,
      message: "Router permission added/updated successfully",
      data: routerPermission,
    });
  } catch (error) {
    console.error("Error adding/updating router permission:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry error",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRouterPermission = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { router_endpoint } = req.body;

    // Validate required fields
    if (!router_endpoint) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: router_endpoint",
      });
    }

    const routerPermission = await RouterPermission.find({
      router_endpoint,
    }).populate("permission_id");

    return res.status(200).json({
      success: true,
      message: "get Router permission  successfully",
      data: routerPermission,
    });
  } catch (error) {
    console.error("Error adding/updating router permission:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry error",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
