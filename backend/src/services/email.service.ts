import { env } from "../config/env.js";

export const emailService = {
  async sendPasswordResetEmail(email: string, name: string, rawToken: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_ORIGIN}/account?mode=reset&token=${rawToken}`;

    if (env.NODE_ENV !== "production") {
      // In development / test environment, output the reset link for testing
      console.log(`\n========================================`);
      console.log(`[EMAIL SERVICE] Password Reset Request`);
      console.log(`To: ${name} <${email}>`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`Expires in: 30 minutes`);
      console.log(`========================================\n`);
      return;
    }

    // In production, if external transactional email service (e.g. SMTP/Resend/Postmark) is configured, send here.
    // Otherwise log safe operational warning without leaking raw token.
    console.warn(`[EMAIL SERVICE] Transactional email provider not configured for production. Reset link generated for ${email}.`);
  }
};
