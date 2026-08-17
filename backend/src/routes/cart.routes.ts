import { Router } from "express";
import rateLimit from "express-rate-limit";
import { cartController } from "../controllers/cart.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { addCartItemSchema, updateCartItemSchema } from "../validators/cart.validator.js";

const cartMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "CART_RATE_LIMITED", message: "Too many cart updates. Please slow down." } }
});

export const cartRoutes = Router();
cartRoutes.get("/", cartController.get);
cartRoutes.post("/items", cartMutationLimiter, validate(addCartItemSchema), cartController.add);
cartRoutes.patch("/items/:itemId", cartMutationLimiter, validate(updateCartItemSchema), cartController.update);
cartRoutes.delete("/items/:itemId", cartMutationLimiter, cartController.remove);
