"use client";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function FloatingCartButton() {
  const { count, isDrawerOpen, openDrawer } = useCart();
  const pathname = usePathname();

  // Do not show if cart is empty, drawer is open, or on dedicated cart/checkout pages
  if (count <= 0 || isDrawerOpen || pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  return (
    <button
      type="button"
      className="floating-cart-toggle"
      onClick={openDrawer}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingBag size={22} aria-hidden="true" />
      <span className="floating-cart-badge">{count}</span>
    </button>
  );
}
