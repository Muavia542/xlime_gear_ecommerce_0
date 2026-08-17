import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(10).max(128),
    phone: z.string().max(40).optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }),
  params: z.object({}),
  query: z.object({})
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  }),
  params: z.object({}),
  query: z.object({})
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10).max(256),
    password: z.string().min(10).max(128)
  }),
  params: z.object({}),
  query: z.object({})
});
