import { z } from "zod";

const productBody = z.object({
  slug: z.string().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sku: z.string().min(2).max(80).optional().nullable(),
  name: z.string().min(2).max(180),
  shortDescription: z.string().min(5).max(500),
  description: z.string().min(10).max(10000),
  subcategory: z.string().min(2).max(120),
  sport: z.string().max(100).optional().nullable(),
  gender: z.string().max(60).default("Unisex"),
  fabric: z.string().max(120).optional().nullable(),
  fit: z.string().max(120).optional().nullable(),
  productType: z.string().max(80).default("Standard"),
  imageUrl: z.string().min(2).max(2000),
  altText: z.string().max(220).optional().nullable(),
  categoryId: z.string().min(5),
  featured: z.boolean().default(false),
  isCustomizable: z.boolean().default(false),
  teamOrderEligible: z.boolean().default(false),
  showPrice: z.boolean().default(false),
  pricePence: z.number().int().nonnegative().nullable().optional(),
  stockQuantity: z.number().int().nonnegative().nullable().optional(),
  lowStockThreshold: z.number().int().nonnegative().default(10),
  seoTitle: z.string().max(180).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE")
});

export const createProductSchema = z.object({ body: productBody, params: z.object({}), query: z.object({}) });
export const updateProductSchema = z.object({ body: productBody.partial(), params: z.object({ id: z.string().min(5) }), query: z.object({}) });
export const orderStatusSchema = z.object({ body: z.object({ status: z.enum(["REQUESTED","CONFIRMED","IN_PRODUCTION","READY_TO_SHIP","SHIPPED","COMPLETED","CANCELLED"]) }), params: z.object({ id: z.string().min(5) }), query: z.object({}) });
export const requestStatusSchema = z.object({ body: z.object({ status: z.enum(["NEW","REVIEWING","QUOTED","APPROVED","IN_PRODUCTION","COMPLETED","CANCELLED"]) }), params: z.object({ id: z.string().min(5) }), query: z.object({}) });

export const createCategorySchema = z.object({ body: z.object({ slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().min(2).max(100), description: z.string().max(2000).optional().nullable(), imageUrl: z.string().max(2000).optional().nullable(), sortOrder: z.number().int().nonnegative().default(0), isActive: z.boolean().default(true), subcategories: z.array(z.string().min(1).max(100)).max(50).optional(), seoTitle: z.string().max(180).optional().nullable(), seoDescription: z.string().max(320).optional().nullable() }), params: z.object({}), query: z.object({}) });
export const updateCategorySchema = z.object({ body: createCategorySchema.shape.body.partial(), params: z.object({ id: z.string().min(5) }), query: z.object({}) });

export const productImageSchema = z.object({ body: z.object({ url: z.string().min(2).max(3000), alt: z.string().min(2).max(220), sortOrder: z.number().int().nonnegative().optional(), setCover: z.boolean().optional() }), params: z.object({ id: z.string().min(5) }), query: z.object({}) });
