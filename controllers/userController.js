import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { PasswordReset } from "../models/passwordReset.js";
import { Blacklist } from "../models/blacklist.js";
import { validationResult } from "express-validator";
import { sendMail } from "../helpers/mailer.js";
import randomstring from "randomstring";
import jwt from "jsonwebtoken";
import { deleteImage } from "../helpers/deletefile.js";
import path from "path";
export const userRegister = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Errors ", errors: error.array() });
    }
    const { name, email, mobile, password, countryCode } = req.body;
    const isExists = await User.findOne({ email });
    if (isExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      mobile,
      countryCode,
      password: hashPassword,
      is_verified: "0",
      image: req.file ? "image/" + req.file.path : "",
    });
    await user.save();
    const msg = `<p>Congratulations! ${name} You have successfully registered!</p>`;
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const mailVerification = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.render("404");
    }
    const userData = await User.findOne({ _id: req.query.id }).lean();
    if (userData) {
      if (userData.is_verified === "1") {
        return res.render("mail-verification", {
          message: "mail already verified",
        });
      }
      await User.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            is_verified: "1",
          },
        }
      );
      return res.render("mail-verification", {
        message: "mail verified successfully",
      });
    } else {
      return res.render("mail-verification", {
        message: "User not found",
      });
    }
  } catch (err) {
    return res.render("404");
  }
};
export const sendMailVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    if (userData.is_verified === "1") {
      return res
        .status(400)
        .json({ success: false, msg: "Email already verified" });
    }
    const verificationLink = `http://127.0.0.1:8001/mail-verification?id=${userData._id}`;
    const msg = `<p>Congratulations, ${userData?.name}! Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`;
    await sendMail({ email, subject: "Registration Successful", text: msg });
    return res
      .status(200)
      .json({ success: true, msg: "Verification link sent successfully" });
  } catch (err) {
    console.error("Error in sendMailVerification:", err.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: err.message,
    });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }
    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    const randonString = randomstring.generate();
    const verificationLink = `http://localhost:3000/reset-password?token=${randonString}`;
    const msg = `<p>Hi, ${userData?.name}! Please reset your password by clicking <a href="${verificationLink}">here</a>.</p>`;
    await PasswordReset.deleteMany({ user_id: userData._id });
    const passwordReset = new PasswordReset({
      user_id: userData._id,
      token: randonString,
    });
    await passwordReset.save();
    // await sendMail({ email, subject: "Reset Password", text: msg });
    return res
      .status(200)
      .json({ success: true, msg: "Reset password link sent successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const passwordResetData = await PasswordReset.findOne({ token });
    if (!passwordResetData) {
      return res.status(404).json({ success: false, msg: "Invalid token" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      { _id: passwordResetData.user_id },
      {
        $set: {
          password: hashPassword,
        },
      }
    );
    await PasswordReset.deleteOne({ token });
    return res
      .status(200)
      .json({ success: true, msg: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "600s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });
};
export const userLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const userData = await User.findOne({ email }).lean();
    if (!userData) {
      return res
        .status(401)
        .json({ success: false, msg: "Email and password is Incorrect" });
    }
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Email and password is Incorrect" });
    }
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);
    return res.status(200).json({
      success: true,
      msg: "Login successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,

      tokenType: "Bearer",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const userProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "User profile verify successfully",
      user: req.user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      msg: "Validation errors",
      errors: errors.array(),
    });
  }
  try {
    const { name, mobile } = req.body;
    // Define the data object with appropriate type annotation
    const data = {
      name,
      mobile,
    };
    const user_id = req.user?.user._id;
    if (req.file !== undefined) {
      data.image = "image/uploads/" + req.file.filename; // Use filename instead of full path
      const oldUser = await User.findById(user_id).lean();
      if (oldUser && oldUser.image) {
        // Fix path construction for image deletion
        const oldfilepath = path.resolve(process.cwd(), oldUser.image);
        console.log("Attempting to delete image at:", oldfilepath);
        await deleteImage(oldfilepath); // Delete the old image file
      }
    }
    if (!req.user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: req.user?.user._id },
      {
        $set: data,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      msg: "User profile updated successfully",
      updatedProfile,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Access _id from the nested user object structure
    const userId = req.user?.user?._id || req.user?._id;

    if (!userId) {
      console.log("User data in token:", req.user); // Debug log
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const userData = await User.findById(userId).lean();
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    return res.status(200).json({
      success: true,
      msg: "Token refreshed successfully",
      accessToken,
      refreshToken,
      tokenType: "Bearer",
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
      return res.status(403).json({ success: false, msg: "Token is required" });
    }
    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    const blacklistToken = new Blacklist({
      token: bearerToken,
    });
    await blacklistToken.save();

    return res.status(200).json({ success: true, msg: "Logout successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
