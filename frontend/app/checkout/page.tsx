"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import SiteFrame from "@/components/layout/SiteFrame";
import { api, assetUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { formatGBP } from "@/lib/seo";

export default function Checkout() {
  const router = useRouter();
  const { cart, refresh } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const items = cart?.items || [];
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

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const r = await api<{ order: { orderNumber: string } }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: fd.get("customerName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          deliveryAddress: {
            line1: fd.get("line1"),
            line2: fd.get("line2"),
            city: fd.get("city"),
            postcode: fd.get("postcode"),
            country: fd.get("country") || "United Kingdom",
          },
          notes: fd.get("notes"),
        }),
      });
      await refresh();
      router.push(
        `/order-confirmation/${r.order.orderNumber}?email=${encodeURIComponent(
          String(fd.get("email"))
        )}`
      );
    } catch (err: any) {
      setError(err.message || "Unable to submit order request");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteFrame>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">Home › Bag › Order Request</div>
          <h1 className="page-title">Order request</h1>
          <p className="muted" style={{ maxWidth: 820 }}>
            Share contact and delivery details so XLIME can review your selection, confirm availability and continue the fulfilment workflow.
          </p>
        </div>
      </div>
      <section className="section">
        <form className="wrap" onSubmit={submit}>
          <div className="steps">
            <div className="step active">1 Contact</div>
            <div className="step active">2 Delivery</div>
            <div className="step">3 Review</div>
            <div className="step">4 Submit</div>
          </div>
          <div className="checkout-grid">
            <div>
              <div className="form-card">
                <h3>Contact details</h3>
                <div className="field">
                  <label>Full name</label>
                  <input name="customerName" defaultValue="Alex Turner" autoComplete="name" required />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input name="email" type="email" defaultValue="alex.turner@example.com" autoComplete="email" required />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input name="phone" defaultValue="+44 7700 900123" autoComplete="tel" required />
                </div>
                <label className="checkout-check">
                  <input type="checkbox" defaultChecked /> Keep me updated on XLIME releases and teamwear news
                </label>
              </div>

              <div className="form-card">
                <h3>Delivery address</h3>
                <div className="field">
                  <label>Address line 1</label>
                  <input name="line1" defaultValue="12 King's Road" autoComplete="address-line1" required />
                </div>
                <div className="field">
                  <label>Address line 2</label>
                  <input name="line2" defaultValue="Apartment 4B" autoComplete="address-line2" />
                </div>
                <div className="checkout-two">
                  <div className="field">
                    <label>City</label>
                    <input name="city" defaultValue="Manchester" autoComplete="address-level2" required />
                  </div>
                  <div className="field">
                    <label>Postcode</label>
                    <input name="postcode" defaultValue="M1 2AB" autoComplete="postal-code" required />
                  </div>
                </div>
                <div className="field">
                  <label>Country</label>
                  <select name="country" defaultValue="United Kingdom">
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="form-card">
                <h3>Shipping method</h3>
                <label className="checkout-radio">
                  <input type="radio" defaultChecked name="ship" /> Standard delivery <span>Confirmed after review</span>
                </label>
                <label className="checkout-radio">
                  <input type="radio" name="ship" /> Express delivery <span>Subject to availability</span>
                </label>
              </div>

              <div className="form-card">
                <h3>Order notes</h3>
                <div className="field">
                  <label>Sizes / quantities / custom requirements</label>
                  <textarea name="notes" defaultValue="Please confirm sizes, availability and final order details." />
                </div>
                <p className="muted" style={{ fontSize: 11 }}>
                  The XLIME team reviews the request and confirms the next step directly.
                </p>
              </div>
            </div>

            <aside className="summary">
              <h2 className="display" style={{ fontSize: 36, marginTop: 0 }}>
                Order summary
              </h2>
              {items.length ? (
                items.map((x: any) => (
                  <div className="drawer-item" key={x.id}>
                    <Image
                      src={assetUrl(x.product.imageUrl)}
                      width={80}
                      height={66}
                      alt={x.product.altText || x.product.name}
                    />
                    <div>
                      <b>{x.product.name}</b>
                      <div className="muted">
                        Qty {x.quantity}
                        {x.customisation?.size ? ` • Size ${x.customisation.size}` : ""}
                      </div>
                      {allItemsHavePublicPrice && x.product?.pricePence != null && (
                        <div style={{ color: "var(--lime)", fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                          {formatGBP(x.product.pricePence * x.quantity)}
                        </div>
                      )}
                    </div>
                    <span className="enquire-mini">Requested</span>
                  </div>
                ))
              ) : (
                <p className="muted">Your bag is empty. Add products before submitting an order request.</p>
              )}

              {allItemsHavePublicPrice ? (
                <div className="summary-line" style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 14 }}>
                  <span style={{ fontWeight: 800, textTransform: "uppercase" }}>Estimated Subtotal</span>
                  <strong style={{ fontSize: 20, color: "var(--lime)" }}>{formatGBP(subtotalPence)}</strong>
                </div>
              ) : (
                <div className="order-note">
                  <b>Details confirmed after review</b>
                  <span>Final order details & pricing confirmed after XLIME reviews your selection.</span>
                </div>
              )}

              {error && <p className="checkout-error">{error}</p>}
              <button className="btn primary full" disabled={busy || !items.length} type="submit">
                {busy ? "Submitting request…" : "Submit order request"}
              </button>
              <p className="muted" style={{ fontSize: 11 }}>
                Secure request flow. XLIME will contact you directly to confirm delivery and finalise your order.
              </p>
            </aside>
          </div>
        </form>
      </section>
    </SiteFrame>
  );
}
