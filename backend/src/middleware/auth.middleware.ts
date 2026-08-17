import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.xlime_session;
    if (!token) return next();
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; sv?: number };
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, role: true, name: true, sessionVersion: true } });
    if (user) {
      if (typeof payload.sv === "number" && user.sessionVersion !== payload.sv) {
        // Session invalidated by password reset
        req.authUser = undefined;
      } else {
        req.authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
      }
    }
    next();
  } catch {
    next();
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.authUser) return next(new HttpError(401, "AUTH_REQUIRED", "Please sign in to continue."));
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.authUser) return next(new HttpError(401, "AUTH_REQUIRED", "Please sign in to continue."));
  if (req.authUser.role !== "ADMIN") return next(new HttpError(403, "ADMIN_REQUIRED", "Admin access is required."));
  next();
}
