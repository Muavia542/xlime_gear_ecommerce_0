import { z } from "zod";
export const orderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2).max(120), email: z.string().email(), phone: z.string().min(5).max(40),
    deliveryAddress: z.object({ line1: z.string().min(2), line2: z.string().optional(), city: z.string().min(2), postcode: z.string().min(2), country: z.string().default("United Kingdom") }),
    notes: z.string().max(3000).optional()
  }), params: z.object({}), query: z.object({})
});
