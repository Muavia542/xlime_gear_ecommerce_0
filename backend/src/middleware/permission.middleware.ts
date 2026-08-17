import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { env } from "../config/env.js";

export function requirePermission(permissionKey: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.authUser) throw new HttpError(401, "AUTH_REQUIRED", "Please sign in to continue.");
      if (req.authUser.role !== "ADMIN") throw new HttpError(403, "ADMIN_REQUIRED", "Admin access is required.");
      const membership = await prisma.adminMembership.findUnique({
        where: { userId: req.authUser.id },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });
      // Local-upgrade compatibility only. Production is fail-closed if an ADMIN lacks explicit membership.
      if (!membership) {
        if (env.NODE_ENV === "production") throw new HttpError(403, "ADMIN_ROLE_REQUIRED", "This admin account has not been assigned an Operations Hub role.");
        return next();
      }
      if (!membership.isActive) throw new HttpError(403, "ADMIN_DISABLED", "This admin account is disabled.");
      const allowed = membership.role.key === "SUPER_ADMIN" || membership.role.permissions.some((p) => p.permission.key === permissionKey);
      if (!allowed) throw new HttpError(403, "PERMISSION_DENIED", "You do not have permission to perform this action.");
      next();
    } catch (error) { next(error); }
  };
}
