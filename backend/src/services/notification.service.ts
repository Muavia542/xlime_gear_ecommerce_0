import { prisma } from "../config/prisma.js";

export async function createNotification(input: { type: string; title: string; message: string; entityType?: string; entityId?: string }) {
  return prisma.notification.create({ data: input });
}
