import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(99).optional().default(1),
    customisation: z.object({
      variantId: z.string().min(1).max(100).optional(),
      size: z.string().max(50).optional(),
      color: z.string().max(50).optional()
    }).passthrough().optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1).max(99)
  }),
  params: z.object({
    itemId: z.string().min(1).max(100)
  }),
  query: z.object({})
});
