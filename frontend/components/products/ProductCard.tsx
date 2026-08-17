"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { assetUrl } from "@/lib/api";
import { formatGBP } from "@/lib/seo";
import { useCart } from "@/context/CartContext";

function requiresVariantChoice(p: Product): boolean {
  const activeVariants = (p.variants || []).filter(v => v.isActive && v.stock > 0);
  if (activeVariants.length > 1) return true;
  return false;
}

export default function ProductCard({product,onQuickView}:{product:Product;onQuickView?:(p:Product)=>void}){
 const router = useRouter();
 const { add, openDrawer } = useCart();
 const [busy, setBusy] = useState(false);
 const [added, setAdded] = useState(false);
 const tag = product.featured ? "Featured" : product.isCustomizable ? "Custom" : "";
 const needsChoice = requiresVariantChoice(product);

 async function handleAddToCart(e: React.MouseEvent) {
   e.preventDefault();
   e.stopPropagation();

   if (needsChoice) {
     if (onQuickView) {
       onQuickView(product);
     } else {
       router.push(`/product/${product.slug}`);
     }
     return;
   }

   const activeVariants = (product.variants || []).filter(v => v.isActive && v.stock > 0);
   const customisation = activeVariants.length === 1 ? { variantId: activeVariants[0].id } : undefined;

   setBusy(true);
   try {
     await add(product.id, 1, customisation);
     setAdded(true);
     openDrawer();
     setTimeout(() => setAdded(false), 2200);
   } catch {
     if (onQuickView) onQuickView(product);
   } finally {
     setBusy(false);
   }
 }

 return <article className="product-card">
  <div className="product-image">
   {tag&&<span className="tag">{tag}</span>}
   <Link className="product-image-link" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}><Image src={assetUrl(product.imageUrl)} alt={product.altText||`${product.name} by XLIME GEAR`} fill sizes="(max-width:760px) 66vw, (max-width:1100px) 32vw, 240px" style={{objectFit:"cover"}}/></Link>
   <div className="quick">{onQuickView?<button type="button" className="btn primary full sm quick-btn" onClick={()=>onQuickView(product)}>Quick view</button>:<Link className="btn primary full sm" href={`/product/${product.slug}`}>View product</Link>}</div>
  </div>
  <div className="meta">
    <div className="path">{product.category.name} / {product.subcategory}</div>
    <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
    <div className="muted" style={{fontSize:11}}>{product.sport||product.productType||"XLIME GEAR"}</div>
    {product.showPrice&&product.pricePence!=null?<strong className="public-price">{formatGBP(product.pricePence)}</strong>:<div className="enquire-label">Contact for order details</div>}
    <div className="swatches" aria-label="Available colour direction"><i style={{background:"#111"}}/><i style={{background:"#C8FF00"}}/><i style={{background:"#aaa"}}/></div>
    <div className="product-card-actions">
      <button
        type="button"
        className={`product-card-btn ${added ? "added" : ""}`}
        onClick={handleAddToCart}
        disabled={busy}
        aria-label={needsChoice ? `Choose options for ${product.name}` : `Add ${product.name} to cart`}
      >
        {added ? <><Check size={13}/> Added ✓</> : busy ? "Adding…" : <><ShoppingBag size={13}/> {needsChoice ? "Select Size / Add" : "ADD TO CART"}</>}
      </button>
    </div>
  </div>
 </article>;
}
