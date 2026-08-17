import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { HttpError } from "../utils/httpError.js";
import { makeReference } from "../utils/numbers.js";

export async function createOrderFromCart(cartId: string, userId: string | undefined, input: any) {
  const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: { items: { include: { product: true } } } });
  if (!cart || cart.items.length === 0) throw new HttpError(400, "EMPTY_CART", "Your bag is empty.");
  return prisma.$transaction(async tx => {
    const order = await tx.order.create({ data: {
      orderNumber: makeReference("XL"), userId, customerName: input.customerName, email: input.email, phone: input.phone,
      deliveryAddress: input.deliveryAddress, notes: input.notes,
      items: { create: cart.items.map(item => ({ productId: item.productId, productName: item.product.name, productSlug: item.product.slug, imageUrl: item.product.imageUrl, quantity: item.quantity, customisation: item.customisation == null ? Prisma.JsonNull : item.customisation as Prisma.InputJsonValue })) }
    }, include: { items: true } });
    await tx.cartItem.deleteMany({ where: { cartId } });
    return order;
  });
}
