import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { env } from "./config/env.js";
import { optionalAuth } from "./middleware/auth.middleware.js";
import { originGuard } from "./middleware/security.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { cartRoutes } from "./routes/cart.routes.js";
import { orderRoutes } from "./routes/order.routes.js";
import { requestRoutes } from "./routes/request.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { adminV2Routes } from "./routes/admin-v2.routes.js";
import { uploadRoutes } from "./routes/upload.routes.js";
import { contentRoutes } from "./routes/content.routes.js";

export const app = express();
app.disable("x-powered-by");

const trustProxySetting = env.TRUST_PROXY === "true"
  ? true
  : env.TRUST_PROXY === "false"
  ? false
  : !isNaN(Number(env.TRUST_PROXY))
  ? Number(env.TRUST_PROXY)
  : env.TRUST_PROXY;
app.set("trust proxy", trustProxySetting);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));
app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization","X-Requested-With"] }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "production" ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } }
}));
app.use(express.json({ limit: "750kb" }));
app.use(express.urlencoded({ extended: false, limit: "750kb", parameterLimit: 100 }));
app.use(cookieParser());
app.use(originGuard);
app.use(optionalAuth);

// Sensitive/session-backed responses must never be cached by shared proxies or browsers.
app.use(["/api/auth", "/api/cart", "/api/orders", "/api/admin"], (_req, res, next) => { res.set("Cache-Control", "no-store, private"); next(); });

app.use("/uploads", express.static(path.resolve("uploads"), { maxAge: env.NODE_ENV === "production" ? "30d" : 0, immutable: env.NODE_ENV === "production", dotfiles: "deny", fallthrough: false }));
app.get("/api/health", (_req, res) => res.set("Cache-Control", "no-store").json({ status: "ok", service: "xlime-gear-api", environment: env.NODE_ENV }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", requestRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/v2", adminV2Routes);
app.use(errorHandler);
