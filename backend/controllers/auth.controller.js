import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSuccessPasswordResetEmail,
} from "../mailtrap/emails.js";
import { connectDB } from "../db/connectdb.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    await connectDB();
    if (!email || !password || !name) {
      throw new Error("Please fill all the fields");
    }

    const userAlreadyExists = await User.findOne({ email });
    console.log(userAlreadyExists);
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    // jwt token
    generateTokenAndSetCookie(res, user._id);

    sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    await connectDB();
    const user = await User.findOne({
      verificationToken: { $eq: code },
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectDB();
    if (!email || !password) {
      throw new Error("Please fill all the fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // jwt token for the session

    generateTokenAndSetCookie(res, user._id);

    // update last login
    user.lastLoginDate = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    throw new Error("Failed to login", error);
  }
};

export const logout = async (req, res) => {
  // clear cookie
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await connectDB();

    if (!email) {
      throw new Error("Please provide an email address");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // send reset password email
    sendResetPasswordEmail(user.email, resetURL);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    throw new Error("Failed to send verification email", error);
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    await connectDB();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // update the password

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    // send email for successful password reset

    sendSuccessPasswordResetEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to reset password", error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {}
};
