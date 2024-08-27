import express from "express";

const authRoutes = express.Router();

import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

//auth authRoutes
authRoutes.get("/check-auth", verifyToken, checkAuth);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword);

export default authRoutes;
