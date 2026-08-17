import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { emailService } from "./email.service.js";

function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

export const authService = {
  async register(input: { name: string; email: string; password: string; phone?: string }) {
    const email = input.email.trim().toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) throw new HttpError(409, "EMAIL_EXISTS", "An account already exists for this email.");
    const passwordHash = await bcrypt.hash(input.password, 12);
    return prisma.user.create({ data: { name: input.name.trim(), email, phone: input.phone, passwordHash }, select: { id: true, name: true, email: true, phone: true, role: true } });
  },

  async login(emailInput: string, password: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    const token = jwt.sign({ sub: user.id, sv: user.sessionVersion }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] });
    return { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } };
  },

  async forgotPassword(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Invalidate existing unused tokens for this user
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await prisma.passwordResetToken.create({
        data: {
          tokenHash,
          expiresAt,
          userId: user.id
        }
      });

      await emailService.sendPasswordResetEmail(user.email, user.name, rawToken);
    }

    // Always return generic anti-enumeration response
    return { message: "If an account exists for that email, a reset link has been sent." };
  },

  async resetPassword(tokenInput: string, newPassword: string) {
    const tokenHash = hashResetToken(tokenInput);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!resetToken || resetToken.usedAt != null || resetToken.expiresAt < new Date()) {
      throw new HttpError(400, "INVALID_OR_EXPIRED_TOKEN", "Password reset token is invalid, already used, or expired.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction(async (tx) => {
      // Update password and increment session version to invalidate all active JWTs
      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash,
          sessionVersion: { increment: 1 }
        }
      });

      // Mark token as used
      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() }
      });

      // Clear any other reset tokens for this user
      await tx.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          id: { not: resetToken.id }
        }
      });
    });

    return { message: "Password has been successfully reset. Please sign in with your new password." };
  }
};
