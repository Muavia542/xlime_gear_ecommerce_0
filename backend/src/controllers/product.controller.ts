import type { Request, Response } from "express";
import { productService } from "../services/product.service.js";
import { prisma } from "../config/prisma.js";
import { routeParam } from "../utils/request.js";
export const productController = {
  list: async (req: Request, res: Response) => res.json({ products: await productService.list(typeof req.query.category === "string" ? req.query.category : undefined, typeof req.query.q === "string" ? req.query.q : undefined) }),
  bySlug: async (req: Request, res: Response) => { const product = await productService.bySlug(routeParam(req,"slug")); prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } }).catch(()=>{}); res.json({ product }); },
  categories: async (_req: Request, res: Response) => res.json({ categories: await prisma.category.findMany({ orderBy: { sortOrder: "asc" } }) })
};
