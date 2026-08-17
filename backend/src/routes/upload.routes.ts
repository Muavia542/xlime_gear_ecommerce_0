import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import path from "node:path";
import crypto from "node:crypto";
import { uploadController } from "../controllers/upload.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const allowed = new Set(["image/jpeg","image/png","image/webp"]);
const storage = multer.diskStorage({
  destination: path.resolve("uploads"),
  filename: (_req, file, cb) => {
    const ext = file.mimetype === "image/png" ? ".png" : file.mimetype === "image/webp" ? ".webp" : ".jpg";
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5, parts: 10 },
  fileFilter: (_req, file, cb) => cb(null, allowed.has(file.mimetype)),
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "UPLOAD_RATE_LIMITED", message: "Too many upload requests. Please try again shortly." } }
});

export const uploadRoutes = Router();
uploadRoutes.post("/", requireAdmin, uploadLimiter, upload.single("file"), uploadController.single);
