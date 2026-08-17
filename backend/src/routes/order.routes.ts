import { Router } from "express";
import rateLimit from "express-rate-limit";
import { orderController } from "../controllers/order.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { orderSchema } from "../validators/order.validator.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "ORDER_RATE_LIMITED", message: "Too many order requests. Please try again shortly." } }
});

export const orderRoutes = Router();
orderRoutes.post("/", orderLimiter, validate(orderSchema), orderController.create);
orderRoutes.get("/mine", requireAuth, orderController.mine);
orderRoutes.get("/:orderNumber", orderController.byNumber);
