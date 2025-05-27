import {
  getrouterPermission,
  getUserPermissionHelper,
} from "./getUserPermissionHelper.js";

export const checkPermission = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      const routerPermission = await getrouterPermission(
        req.path,
        req.user.role
      );
      const userPermission = await getUserPermissionHelper(req.user._id);
      if (
        userPermission.permissions.permissions == undefined ||
        !routerPermission
      ) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      const permission_name = routerPermission.permission_id.permission_name;
      const permissions_value = routerPermission.permission;

      const userPermissions = userPermission.permissions.permission.some(
        (permission) =>
          permission.permission_name === permission_name &&
          permission.permission_value.some((value) =>
            permissions_value.includes(value)
          )
      );

      if (!userPermissions) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }
    }
    return next();
  } catch (error) {
    console.error("Error checking permission:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
