import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "AUTH_RATE_LIMITED", message: "Too many authentication attempts. Try again later." } }
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "AUTH_RATE_LIMITED", message: "Too many registration attempts. Try again later." } }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "AUTH_RATE_LIMITED", message: "Too many password reset requests. Try again later." } }
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "AUTH_RATE_LIMITED", message: "Too many password reset attempts. Try again later." } }
});

export const authRoutes = Router();
authRoutes.post("/register", registerLimiter, validate(registerSchema), authController.register);
authRoutes.post("/login", loginLimiter, validate(loginSchema), authController.login);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/me", authController.me);
authRoutes.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
authRoutes.post("/reset-password", resetPasswordLimiter, validate(resetPasswordSchema), authController.resetPassword);
