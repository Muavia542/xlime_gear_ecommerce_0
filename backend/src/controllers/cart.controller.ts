import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { addCartItem, getOrCreateCart } from "../services/cart.service.js";
import { env } from "../config/env.js";
import { routeParam } from "../utils/request.js";

const cartCookie = { httpOnly: true, secure: env.COOKIE_SECURE, sameSite: "lax" as const, maxAge: 30 * 24 * 60 * 60 * 1000, path: "/" };
async function resolved(req: Request, res: Response) {
  const token = req.cookies?.xlime_cart;
  const cart = await getOrCreateCart(req.authUser?.id, token);
  if (!req.authUser && cart.guestToken) {
    if (!req.cookies) req.cookies = {};
    req.cookies.xlime_cart = cart.guestToken;
    res.cookie("xlime_cart", cart.guestToken, cartCookie);
  }
  return cart;
}
async function fetchCart(cartId: string, guestToken?: string | null) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: { include: { images: true, category: true } } } } }
  });
  return cart ? { ...cart, guestToken } : null;
}
export const cartController = {
  get: async (req: Request, res: Response) => res.json({ cart: await resolved(req, res) }),
  add: async (req: Request, res: Response) => {
    const cart = await resolved(req, res);
    await addCartItem(cart.id, req.body.productId, Number(req.body.quantity || 1), req.body.customisation);
    prisma.product.update({ where: { id: req.body.productId }, data: { cartAddCount: { increment: 1 } } }).catch(()=>{});
    const updated = await fetchCart(cart.id, cart.guestToken);
    res.status(201).json({ cart: updated });
  },
  update: async (req: Request, res: Response) => {
    const cart = await resolved(req, res);
    const item = await prisma.cartItem.findFirst({ where: { id: routeParam(req,"itemId"), cartId: cart.id } });
    if (!item) return res.status(404).json({ error: { code: "ITEM_NOT_FOUND", message: "Bag item not found." } });
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: Math.max(1, Math.min(Number(req.body.quantity || 1), 99)) } });
    const updated = await fetchCart(cart.id, cart.guestToken);
    res.json({ cart: updated });
  },
  remove: async (req: Request, res: Response) => {
    const cart = await resolved(req, res);
    await prisma.cartItem.deleteMany({ where: { id: routeParam(req,"itemId"), cartId: cart.id } });
    const updated = await fetchCart(cart.id, cart.guestToken);
    res.json({ cart: updated });
  }
};
