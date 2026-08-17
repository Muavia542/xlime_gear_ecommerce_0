import type { Request } from "express";
import { prisma } from "../config/prisma.js";

export async function createAuditLog(req: Request, action: string, entityType: string, entityId?: string, description?: string, metadata?: unknown) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.authUser?.id,
        action,
        entityType,
        entityId,
        description,
        metadata: metadata as any,
        ipAddress: req.ip,
        userAgent: req.get("user-agent") || undefined,
      },
    });
  } catch (error) {
    // Auditing should never crash the business operation; log for ops review.
    console.error("Audit log write failed", error);
  }
}
