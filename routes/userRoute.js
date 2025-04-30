import express from "express";
import multer from "multer";
import {
  registorValidation,
  sendMailVelidator,
  passwordResetValidator,
  loginValidator,
  updateProfileValidator,
} from "../helpers/validation.js";
import {
  userRegister,
  sendMailVerification,
  forgetPassword,
  updatePassword,
  userLogin,
  userProfile,
  updateProfile,
  refreshToken,
  logout,
} from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();
router.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, "uploads");
    }
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const extName = file.originalname.split(".").pop();
    const filename = `${timestamp}.${extName}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File type is not supported"), false);
  }
};
const upload = multer({ storage: storage, fileFilter });
// Wrap controller functions to match RequestHandler type
const wrapHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
      return;
    } catch (error) {
      next(error);
    }
  };
};
router.post(
  "/register",
  upload.single("image"),
  registorValidation,
  wrapHandler(userRegister)
);
router.post(
  "/send-mail-verification",
  sendMailVelidator,
  wrapHandler(sendMailVerification)
);
router.post(
  "/forget-password",
  passwordResetValidator,
  wrapHandler(forgetPassword)
);
router.post("/update-password", wrapHandler(updatePassword));
router.post("/login", loginValidator, wrapHandler(userLogin));
router.get("/profile", verifyToken, wrapHandler(userProfile));
router.post(
  "/update-profile",
  upload.single("image"),
  verifyToken,
  updateProfileValidator,
  wrapHandler(updateProfile)
);

router.get("/refresh-token", verifyToken, wrapHandler(refreshToken));

router.get("/logout", verifyToken, wrapHandler(logout));
export default router;
