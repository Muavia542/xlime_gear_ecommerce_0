"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { assetUrl } from "@/lib/api";
import { formatGBP } from "@/lib/seo";

export default function CartDrawer() {
  const { cart, count, isDrawerOpen, closeDrawer, update, remove } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const items = cart?.items || [];

  // Close on Escape key and lock body scroll when open
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen, closeDrawer]);

  // Mixed price cart check: all items must have valid public price to show subtotal
  const allItemsHavePublicPrice =
    items.length > 0 &&
    items.every(
      (item: any) =>
        item.product?.showPrice === true &&
        typeof item.product?.pricePence === "number" &&
        item.product?.pricePence > 0
    );

  const subtotalPence = allItemsHavePublicPrice
    ? items.reduce(
        (sum: number, item: any) =>
          sum + (item.product.pricePence || 0) * item.quantity,
        0
      )
    : 0;

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isDrawerOpen ? "open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`cart-drawer ${isDrawerOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
      >
        <header className="cart-drawer-header">
          <div className="cart-drawer-title">
            <h2 id="cart-drawer-heading">XLIME Bag</h2>
            <span>({count} {count === 1 ? "item" : "items"})</span>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeDrawer}
            aria-label="Close shopping bag drawer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">
              <ShoppingBag size={48} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
              <h3>Your bag is empty</h3>
              <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
                Explore the latest XLIME sportswear, activewear and custom ranges.
              </p>
              <Link
                href="/shop"
                className="btn primary full sm"
                onClick={closeDrawer}
              >
                Shop XLIME
              </Link>
            </div>
          ) : (
            <div className="cart-drawer-items">
              {items.map((item: any) => {
                const hasPrice =
                  item.product?.showPrice && item.product?.pricePence != null;
                const sizeLabel = item.customisation?.size;

                return (
                  <div className="cart-drawer-item" key={item.id}>
                    <Image
                      src={assetUrl(item.product.imageUrl)}
                      width={72}
                      height={72}
                      alt={item.product.altText || item.product.name}
                    />
                    <div className="cart-drawer-item-info">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeDrawer}
                      >
                        <strong>{item.product.name}</strong>
                      </Link>
                      <small>
                        {item.product.category?.name || "XLIME"} • {item.product.subcategory}
                      </small>
                      {sizeLabel && (
                        <small style={{ color: "var(--lime)", marginTop: 2 }}>
                          Size: {String(sizeLabel)}
                        </small>
                      )}

                      {hasPrice && allItemsHavePublicPrice && (
                        <div className="drawer-price" style={{ marginTop: 4, fontSize: 13 }}>
                          {formatGBP(item.product.pricePence * item.quantity)}
                          {item.quantity > 1 && (
                            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6, fontWeight: 400 }}>
                              ({formatGBP(item.product.pricePence)} each)
                            </span>
                          )}
                        </div>
                      )}

                      <div className="cart-drawer-item-qty">
                        <button
                          type="button"
                          onClick={() => update(item.id, Math.max(1, item.quantity - 1))}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => update(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-drawer-remove"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.product.name} from bag`}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-drawer-footer">
            {allItemsHavePublicPrice ? (
              <div className="cart-drawer-subtotal">
                <span>Subtotal</span>
                <strong>{formatGBP(subtotalPence)}</strong>
              </div>
            ) : (
              <div className="order-note" style={{ margin: "0 0 14px", padding: "10px 12px" }}>
                <b>Details confirmed after review</b>
                <span>Final order details & pricing confirmed after XLIME reviews your selection.</span>
              </div>
            )}

            <div className="cart-drawer-actions">
              <Link
                href="/checkout"
                className="btn primary full"
                onClick={closeDrawer}
              >
                Continue to Order Request <ArrowRight size={15} />
              </Link>
              <Link
                href="/cart"
                className="btn full sm"
                onClick={closeDrawer}
              >
                View Full Bag
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
