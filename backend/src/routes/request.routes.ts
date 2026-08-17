import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requestController } from "../controllers/request.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { customKitSchema, teamOrderSchema } from "../validators/request.validator.js";

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { error: { code: "ENQUIRY_RATE_LIMITED", message: "Too many requests from this connection. Please try again later or contact XLIME GEAR directly." } },
});

export const requestRoutes = Router();
requestRoutes.post("/team-orders", enquiryLimiter, validate(teamOrderSchema), requestController.team);
requestRoutes.post("/custom-kits", enquiryLimiter, validate(customKitSchema), requestController.customKit);
