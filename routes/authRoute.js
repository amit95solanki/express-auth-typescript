import express from "express";
import { updatePassword, mailVerification } from "../controllers/userController.js";
import bodyParser from "body-parser";
const router = express.Router();
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// Wrap controller function to match RequestHandler type
const wrapHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (error) {
            next(error);
        }
    };
};
router.post("/update-password", wrapHandler(updatePassword));
router.get("/mail-verification", mailVerification);
export default router;
