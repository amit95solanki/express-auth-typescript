import { check } from "express-validator";
const isValidImage = (value, { req }) => {
    if (!req.file)
        return false;
    return (req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/jpg");
};
export const registorValidation = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("mobile", "Please include a valid mobile number").isLength({
        min: 10,
        max: 10,
    }),
    check("password", "Please enter a password with 6 or more characters")
        .isLength({ min: 6 })
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    check("image", "Please upload an image").custom(isValidImage),
];
export const sendMailVelidator = [
    check("email", "Please include a valid email")
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: true }),
];
export const passwordResetValidator = [
    check("email", "Please include a valid email")
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: true }),
];
export const loginValidator = [
    check("email", "Please include a valid email")
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: true }),
    check("password", "password is required").not().isEmpty(),
];
export const updateProfileValidator = [
    check("name", "Name is required").not().isEmpty(),
    check("mobile", "Please include a valid mobile number").isLength({
        min: 10,
        max: 10,
    }),
    check("image", "Please upload an image").custom(isValidImage),
];
