import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { routeParam } from "../utils/request.js";

async function audit(userId: string, action: string, entityType: string, entityId?: string, metadata?: unknown) {
  await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata: metadata as any } });
}
export const adminController = {
  dashboard: async (_req: Request, res: Response) => {
    const [products, orders, customers, teamOrders, customKits] = await Promise.all([
      prisma.product.count({ where: { status: "ACTIVE" } }), prisma.order.count(), prisma.user.count({ where: { role: "CUSTOMER" } }), prisma.teamOrderRequest.count(), prisma.customKitRequest.count()
    ]);
    const recentOrders = await prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: true } });
    res.json({ stats: { products, orders, customers, teamOrders, customKits }, recentOrders });
  },
  products: async (_req: Request, res: Response) => res.json({ products: await prisma.product.findMany({ include: { category: true, images: true }, orderBy: { updatedAt: "desc" }, take: 200 }) }),
  createProduct: async (req: Request, res: Response) => { const p = await prisma.product.create({ data: req.body, include: { category: true } }); await audit(req.authUser!.id, "CREATE", "Product", p.id); res.status(201).json({ product: p }); },
  updateProduct: async (req: Request, res: Response) => { const p = await prisma.product.update({ where: { id: routeParam(req,"id") }, data: req.body, include: { category: true } }); await audit(req.authUser!.id, "UPDATE", "Product", p.id); res.json({ product: p }); },
  deleteProduct: async (req: Request, res: Response) => { await prisma.product.update({ where: { id: routeParam(req,"id") }, data: { status: "ARCHIVED" } }); await audit(req.authUser!.id, "ARCHIVE", "Product", routeParam(req,"id")); res.status(204).end(); },

  duplicateProduct: async (req: Request, res: Response) => {
    const source = await prisma.product.findUnique({ where: { id: routeParam(req,"id") }, include: { images: true } });
    if (!source) throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found.");
    const suffix = Date.now().toString().slice(-6);
    const product = await prisma.product.create({
      data: {
        slug: `${source.slug}-copy-${suffix}`,
        sku: source.sku ? `${source.sku}-C${suffix}` : null,
        name: `${source.name} Copy`,
        shortDescription: source.shortDescription,
        description: source.description,
        subcategory: source.subcategory,
        sport: source.sport,
        gender: source.gender,
        fabric: source.fabric,
        fit: source.fit,
        productType: source.productType,
        imageUrl: source.imageUrl,
        altText: source.altText,
        featured: false,
        isCustomizable: source.isCustomizable,
        teamOrderEligible: source.teamOrderEligible,
        showPrice: source.showPrice,
        pricePence: source.pricePence,
        stockQuantity: source.stockQuantity,
        lowStockThreshold: source.lowStockThreshold,
        status: "DRAFT",
        tags: source.tags as any,
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
        categoryId: source.categoryId,
        images: { create: source.images.map(i => ({ url: i.url, alt: i.alt, sortOrder: i.sortOrder })) },
      },
      include: { category: true, images: true },
    });
    await audit(req.authUser!.id, "DUPLICATE", "Product", product.id, { sourceId: source.id });
    res.status(201).json({ product });
  },
  addProductImage: async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({ where: { id: routeParam(req,"id") } });
    if (!product) throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found.");
    const max = await prisma.productImage.aggregate({ where: { productId: product.id }, _max: { sortOrder: true } });
    const image = await prisma.productImage.create({ data: { productId: product.id, url: req.body.url, alt: req.body.alt, sortOrder: req.body.sortOrder ?? ((max._max.sortOrder ?? -1) + 1) } });
    if (req.body.setCover) await prisma.product.update({ where: { id: product.id }, data: { imageUrl: image.url, altText: image.alt } });
    await audit(req.authUser!.id, "CREATE", "ProductImage", image.id, { productId: product.id });
    res.status(201).json({ image });
  },
  deleteProductImage: async (req: Request, res: Response) => {
    const image = await prisma.productImage.findUnique({ where: { id: routeParam(req,"imageId") } });
    if (!image || image.productId !== routeParam(req,"id")) throw new HttpError(404, "IMAGE_NOT_FOUND", "Product image not found.");
    await prisma.productImage.delete({ where: { id: image.id } });
    await audit(req.authUser!.id, "DELETE", "ProductImage", image.id, { productId: routeParam(req,"id") });
    res.status(204).end();
  },
  setProductCover: async (req: Request, res: Response) => {
    const image = await prisma.productImage.findUnique({ where: { id: routeParam(req,"imageId") } });
    if (!image || image.productId !== routeParam(req,"id")) throw new HttpError(404, "IMAGE_NOT_FOUND", "Product image not found.");
    await prisma.product.update({ where: { id: routeParam(req,"id") }, data: { imageUrl: image.url, altText: image.alt } });
    await audit(req.authUser!.id, "UPDATE", "Product", routeParam(req,"id"), { coverImageId: image.id });
    res.json({ ok: true, image });
  },
  orders: async (_req: Request, res: Response) => res.json({ orders: await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 200 }) }),
  updateOrder: async (req: Request, res: Response) => { const order = await prisma.order.update({ where: { id: routeParam(req,"id") }, data: { status: req.body.status } }); await audit(req.authUser!.id, "STATUS_CHANGE", "Order", order.id, { status: order.status }); res.json({ order }); },
  teamOrders: async (_req: Request, res: Response) => res.json({ requests: await prisma.teamOrderRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 }) }),
  updateTeamOrder: async (req: Request, res: Response) => res.json({ request: await prisma.teamOrderRequest.update({ where: { id: routeParam(req,"id") }, data: { status: req.body.status } }) }),
  customKits: async (_req: Request, res: Response) => res.json({ requests: await prisma.customKitRequest.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } }, take: 200 }) }),
  updateCustomKit: async (req: Request, res: Response) => res.json({ request: await prisma.customKitRequest.update({ where: { id: routeParam(req,"id") }, data: { status: req.body.status } }) }),
  users: async (_req: Request, res: Response) => res.json({ users: await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 200 }) }),
  categories: async (_req: Request, res: Response) => res.json({ categories: await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, take: 100 }) }),
  createCategory: async (req: Request, res: Response) => { const category = await prisma.category.create({ data: req.body }); await audit(req.authUser!.id, "CREATE", "Category", category.id); res.status(201).json({ category }); },
  updateCategory: async (req: Request, res: Response) => { const category = await prisma.category.update({ where: { id: routeParam(req,"id") }, data: req.body }); await audit(req.authUser!.id, "UPDATE", "Category", category.id); res.json({ category }); },
  deleteCategory: async (req: Request, res: Response) => { const used = await prisma.product.count({ where: { categoryId: routeParam(req,"id"), status: { not: "ARCHIVED" } } }); if (used) throw new HttpError(409, "CATEGORY_IN_USE", "Archive or move products before deleting this category."); await prisma.category.delete({ where: { id: routeParam(req,"id") } }); await audit(req.authUser!.id, "DELETE", "Category", routeParam(req,"id")); res.status(204).end(); },
};
