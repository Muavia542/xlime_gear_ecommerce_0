import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { env } from "../config/env.js";
import { mergeGuestCartIntoUser } from "../services/cart.service.js";

const cookieOptions = { httpOnly: true, secure: env.COOKIE_SECURE, sameSite: "lax" as const, maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" };

export const authController = {
  register: async (req: Request, res: Response) => { const user = await authService.register(req.body); res.status(201).json({ user }); },
  login: async (req: Request, res: Response) => { const { token, user } = await authService.login(req.body.email, req.body.password); await mergeGuestCartIntoUser(req.cookies?.xlime_cart, user.id); res.clearCookie("xlime_cart", { path: "/" }); res.cookie("xlime_session", token, cookieOptions); res.json({ user }); },
  logout: async (_req: Request, res: Response) => { res.clearCookie("xlime_session", { path: "/" }); res.status(204).end(); },
  me: async (req: Request, res: Response) => { res.json({ user: req.authUser || null }); },
  forgotPassword: async (req: Request, res: Response) => { const result = await authService.forgotPassword(req.body.email); res.json(result); },
  resetPassword: async (req: Request, res: Response) => { const result = await authService.resetPassword(req.body.token, req.body.password); res.json(result); }
};
