import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { HttpError } from "../utils/httpError.js";

export async function getOrCreateCart(userId?: string, guestToken?: string) {
  if (userId) return prisma.cart.upsert({ where: { userId }, update: {}, create: { userId }, include: { items: { include: { product: { include: { images: true, category: true } } } } } });
  const token = guestToken || crypto.randomUUID();
  const cart = await prisma.cart.upsert({ where: { guestToken: token }, update: {}, create: { guestToken: token }, include: { items: { include: { product: { include: { images: true, category: true } } } } } });
  return { ...cart, guestToken: token };
}

export async function addCartItem(cartId: string, productId: string, quantity: number, customisation?: unknown) {
  const product = await prisma.product.findFirst({ where: { id: productId, status: "ACTIVE" } });
  if (!product) throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found.");

  const custObj = customisation && typeof customisation === "object" ? (customisation as Record<string, unknown>) : null;
  const requestedVariantId = custObj?.variantId ? String(custObj.variantId) : undefined;

  let finalCustomisation: Prisma.InputJsonValue | typeof Prisma.JsonNull = Prisma.JsonNull;

  if (requestedVariantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: requestedVariantId } });
    if (!variant) throw new HttpError(404, "VARIANT_NOT_FOUND", "Selected variant not found.");
    if (variant.productId !== productId) throw new HttpError(400, "INVALID_VARIANT", "Variant does not belong to this product.");
    if (!variant.isActive) throw new HttpError(400, "INACTIVE_VARIANT", "Selected variant is no longer active.");
    if (variant.stock <= 0) throw new HttpError(400, "OUT_OF_STOCK", "Selected variant is currently out of stock.");
    finalCustomisation = {
      variantId: variant.id,
      ...(variant.size ? { size: variant.size } : {}),
      ...(variant.color ? { color: variant.color } : {})
    };
  } else {
    const activeVariants = await prisma.productVariant.findMany({ where: { productId, isActive: true } });
    if (activeVariants.length > 1) {
      throw new HttpError(400, "VARIANT_REQUIRED", "Please select a size/option for this product.");
    } else if (activeVariants.length === 1) {
      if (activeVariants[0].stock <= 0) throw new HttpError(400, "OUT_OF_STOCK", "Selected product is currently out of stock.");
      finalCustomisation = {
        variantId: activeVariants[0].id,
        ...(activeVariants[0].size ? { size: activeVariants[0].size } : {}),
        ...(activeVariants[0].color ? { color: activeVariants[0].color } : {})
      };
    } else if (custObj && Object.keys(custObj).length > 0) {
      finalCustomisation = custObj as Prisma.InputJsonValue;
    }
  }

  const existingItems = await prisma.cartItem.findMany({ where: { cartId, productId } });
  const finalVariantId = (finalCustomisation as any)?.variantId;

  const matchingItem = existingItems.find(item => {
    const itemCust = item.customisation as any;
    if (finalVariantId) {
      return itemCust?.variantId === finalVariantId;
    }
    if (!finalCustomisation || finalCustomisation === Prisma.JsonNull) {
      return !itemCust || Object.keys(itemCust).length === 0;
    }
    return JSON.stringify(itemCust) === JSON.stringify(finalCustomisation);
  });

  const cleanQuantity = Math.max(1, Math.min(Number(quantity || 1), 99));

  if (matchingItem) {
    const newQty = Math.max(1, Math.min(matchingItem.quantity + cleanQuantity, 99));
    return prisma.cartItem.update({
      where: { id: matchingItem.id },
      data: { quantity: newQty }
    });
  }

  const currentCount = await prisma.cartItem.count({ where: { cartId } });
  if (currentCount >= 50) throw new HttpError(400, "CART_LIMIT_REACHED", "Your bag cannot contain more than 50 distinct items.");

  return prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity: cleanQuantity,
      customisation: finalCustomisation
    }
  });
}

export async function mergeGuestCartIntoUser(guestToken: string | undefined, userId: string) {
  if (!guestToken) return;
  const guest = await prisma.cart.findUnique({ where: { guestToken }, include: { items: true } });
  if (!guest || guest.userId === userId) return;
  const userCart = await prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } });
  await prisma.$transaction(async tx => {
    for (const item of guest.items) {
      await tx.cartItem.create({ data: { cartId: userCart.id, productId: item.productId, quantity: item.quantity, customisation: item.customisation == null ? Prisma.JsonNull : item.customisation as Prisma.InputJsonValue } });
    }
    await tx.cart.delete({ where: { id: guest.id } });
  });
}
