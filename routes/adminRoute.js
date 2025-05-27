import express from "express";
import {
  updatePassword,
  mailVerification,
} from "../controllers/userController.js";
import bodyParser from "body-parser";
import {
  permissionAddValidaor,
  permissiondeleteValidaor,
  permissionEditValidaor,
  storeRoleValidaor,
  createUserValidation,
  updateUserValidation,
  addRouterPermissionValidation,
  getRouterPermissionValidation,
} from "../helpers/validation.js";
import {
  addPermission,
  getPermission,
  deletePermission,
  editPermission,
} from "../controllers/permissionController.js";
import { storeRole, getRole } from "../controllers/roleController.js";
import {
  addRouterPermission,
  getRouterPermission,
} from "../controllers/routerController.js";
import {
  createUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";
import { onlyAdmin } from "../middleware/onlyAdmin.js";
const router = express.Router();
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// Wrap controller function to match RequestHandler type
const wrapHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};
router.post("/update-password", wrapHandler(updatePassword));
router.get("/mail-verification", mailVerification);

router.post("/create-user", createUserValidation, createUser);
router.get("/get-user", verifyToken, getUser);
router.post(
  "/update-user",
  verifyToken,
  updateUserValidation,
  wrapHandler(updateUser)
);

// Permission

router.post(
  "/admin/add-permission",
  permissionAddValidaor,
  wrapHandler(addPermission)
);

router.get(
  "/admin/get-permission",
  verifyToken,
  onlyAdmin,
  wrapHandler(getPermission)
);

router.post(
  "/admin/delete-permission",
  permissiondeleteValidaor,
  wrapHandler(deletePermission)
);

router.post(
  "/admin/edit-permission",
  permissionEditValidaor,
  wrapHandler(editPermission)
);

// role
router.post(
  "/store-role",
  verifyToken,
  onlyAdmin,
  storeRoleValidaor,
  wrapHandler(storeRole)
);

router.get("/get-roles", verifyToken, onlyAdmin, wrapHandler(getRole));

// router permission route
router.post(
  "/add-router-permission",
  verifyToken,
  onlyAdmin,
  addRouterPermissionValidation,
  wrapHandler(addRouterPermission)
);

router.post(
  "/get-router-permission",
  verifyToken,
  onlyAdmin,
  getRouterPermissionValidation,
  wrapHandler(getRouterPermission)
);

export default router;
