import type { Request, Response } from "express";
import { getOrCreateCart } from "../services/cart.service.js";
import { createOrderFromCart } from "../services/order.service.js";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";
import { routeParam } from "../utils/request.js";

export const orderController = {
  create: async (req: Request, res: Response) => {
    const cart = await getOrCreateCart(req.authUser?.id, req.cookies?.xlime_cart);
    const order = await createOrderFromCart(cart.id, req.authUser?.id, req.body);
    res.status(201).json({ order });
  },
  mine: async (req: Request, res: Response) => res.json({ orders: await prisma.order.findMany({ where: { userId: req.authUser!.id }, include: { items: true }, orderBy: { createdAt: "desc" }, take: 100 }) }),
  byNumber: async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({ where: { orderNumber: routeParam(req,"orderNumber") }, include: { items: true } });
    if (!order) throw new HttpError(404, "ORDER_NOT_FOUND", "Order not found.");
    if (order.userId && req.authUser?.role !== "ADMIN" && order.userId !== req.authUser?.id) throw new HttpError(403, "FORBIDDEN", "You cannot access this order.");
    if (!order.userId && order.email.toLowerCase() !== String(req.query.email || "").toLowerCase() && req.authUser?.role !== "ADMIN") throw new HttpError(403, "ORDER_EMAIL_REQUIRED", "Use the order email to view this request.");
    res.json({ order });
  }
};
