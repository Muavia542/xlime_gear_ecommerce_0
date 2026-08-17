"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus,Plus,Trash2 } from "lucide-react";
import SiteFrame from "@/components/layout/SiteFrame";
import { useCart } from "@/context/CartContext";
import { assetUrl } from "@/lib/api";
import { formatGBP } from "@/lib/seo";

export default function CartPage(){
  const {cart,update,remove} = useCart();
  const items = cart?.items || [];
  const selected = items.reduce((n:number,x:any)=>n+x.quantity,0);

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
    <SiteFrame>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">Home › Bag</div>
          <h1 className="page-title">Your bag</h1>
        </div>
      </div>
      <section className="section">
        <div className="wrap cart-layout">
          <div className="cart-items">
            {items.length === 0 ? (
              <div style={{padding:"34px 10px"}}>
                <span className="eyebrow">XLIME Bag</span>
                <h2 className="display" style={{fontSize:44,margin:"8px 0 14px"}}>Your bag is empty.</h2>
                <p className="muted">Build a cross-category selection or explore the latest XLIME collections.</p>
                <Link className="btn primary" href="/shop">Shop XLIME</Link>
              </div>
            ) : (
              items.map((item:any)=>(
                <div className="cart-row" key={item.id}>
                  <Image
                    src={assetUrl(item.product.imageUrl)}
                    width={100}
                    height={78}
                    alt={item.product.altText||item.product.name}
                  />
                  <div>
                    <strong>{item.product.name}</strong>
                    <div className="muted" style={{fontSize:11,marginTop:4}}>
                      {item.product.category?.name} / {item.product.subcategory}
                    </div>
                    {item.customisation?.size && (
                      <div className="muted" style={{fontSize:10,marginTop:3}}>
                        Size {String(item.customisation.size)}
                      </div>
                    )}
                    {allItemsHavePublicPrice && item.product?.pricePence != null && (
                      <div className="cart-price" style={{marginTop:6,fontSize:14}}>
                        {formatGBP(item.product.pricePence * item.quantity)}
                        {item.quantity > 1 && (
                          <span style={{fontSize:11,color:"var(--muted)",marginLeft:6,fontWeight:400}}>
                            ({formatGBP(item.product.pricePence)} each)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="qty">
                    <button
                      aria-label={`Decrease ${item.product.name}`}
                      onClick={()=>update(item.id,Math.max(1,item.quantity-1))}
                    >
                      <Minus size={13}/>
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${item.product.name}`}
                      onClick={()=>update(item.id,item.quantity+1)}
                    >
                      <Plus size={13}/>
                    </button>
                  </div>
                  <button
                    className="btn sm cart-remove"
                    aria-label={`Remove ${item.product.name}`}
                    onClick={()=>remove(item.id)}
                  >
                    <Trash2 size={14}/>
                    <span>Remove</span>
                  </button>
                </div>
              ))
            )}
          </div>
          <aside className="summary">
            <h2 className="display" style={{fontSize:38,marginTop:0}}>Selection summary</h2>
            <div className="summary-line">
              <span>Selected items</span>
              <b>{selected} selected</b>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <span>Confirmed after review</span>
            </div>
            {allItemsHavePublicPrice ? (
              <div className="summary-line" style={{borderTop:"1px solid var(--border)",paddingTop:14,marginTop:14}}>
                <span style={{fontWeight:800,textTransform:"uppercase"}}>Estimated Subtotal</span>
                <strong style={{fontSize:22,color:"var(--lime)"}}>{formatGBP(subtotalPence)}</strong>
              </div>
            ) : (
              <div className="order-note">
                <b>Quote / order details after review</b>
                <span>XLIME will confirm availability, final quantities and order pricing directly with you.</span>
              </div>
            )}
            <Link href={items.length?"/checkout":"/shop"} className="btn primary full" style={{marginTop:16}}>
              {items.length?"Continue to order request":"Continue shopping"}
            </Link>
            {items.length>0 && (
              <Link href="/shop" className="btn full" style={{marginTop:8}}>
                Continue shopping
              </Link>
            )}
          </aside>
        </div>
      </section>
    </SiteFrame>
  );
}
