"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect,useMemo,useState } from "react";
import { X,ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { assetUrl } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { formatGBP } from "@/lib/seo";
function quickSizes(p:Product){const s=p.subcategory.toLowerCase();if(/wallet|bag|cap/.test(s))return["One size"];return["S","M","L","XL","2XL"]}
export default function QuickViewModal({product,onClose}:{product:Product;onClose:()=>void}){
  const imgs=useMemo(()=>[product.imageUrl,...product.images.map(x=>x.url)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5),[product]);
  const[active,setActive]=useState(imgs[0]);
  const[selectedVariantId,setSelectedVariantId]=useState("");
  const[size,setSize]=useState("");
  const[busy,setBusy]=useState(false);
  const{add,openDrawer}=useCart();

  const availableVariants = useMemo(()=> (product.variants||[]).filter(v=>v.isActive), [product.variants]);

  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()};
    document.addEventListener("keydown",key);
    document.body.style.overflow="hidden";
    return()=>{
      document.removeEventListener("keydown",key);
      document.body.style.overflow="";
    };
  },[onClose]);

  return <>
    <div className="modal-backdrop show" onMouseDown={onClose} aria-hidden="true"/>
    <div className="modal show" role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`}>
      <div className="modal-media">
        <div className="modal-image" style={{position:"relative"}}>
          <Image src={assetUrl(active)} alt={product.altText||product.name} fill sizes="(max-width:760px) 100vw, 55vw" style={{objectFit:"contain"}} priority/>
        </div>
        <div className="modal-thumbs">
          {imgs.map((x,i)=><button type="button" key={x} className={`modal-thumb ${active===x?"active":""}`} onClick={()=>setActive(x)} aria-label={`View ${product.name} image ${i+1}`}><Image src={assetUrl(x)} alt={`${product.name} product view ${i+1}`} width={130} height={70}/></button>)}
        </div>
      </div>
      <div className="modal-info">
        <div className="modal-header-actions">
          <button type="button" className="modal-back-btn" onClick={onClose} aria-label="Back to products">
            ← BACK
          </button>
          <button type="button" className="close" onClick={onClose} aria-label="Close quick view">
            <X size={18}/>
          </button>
        </div>
        <span className="eyebrow">{product.category.name} / {product.subcategory}</span>
        <h2 className="display" style={{fontSize:42,margin:"5px 0 10px"}}>{product.name}</h2>
        {product.showPrice&&product.pricePence!=null?<div className="pdp-public-price">{formatGBP(product.pricePence)}</div>:<div className="enquire-pdp">Available for enquiry</div>}
        <p className="muted">{product.shortDescription}</p>
        <div className="field-title">{availableVariants.length>0?"Select option / size":"Size / option"}</div>
        <div className="sizes">
          {availableVariants.length>0 ? (
            availableVariants.map(v=>(
              <button
                key={v.id}
                type="button"
                disabled={v.stock<=0}
                className={`size ${selectedVariantId===v.id?"active":""}`}
                onClick={()=>setSelectedVariantId(v.id)}
                title={v.stock<=0?"Out of stock":undefined}
              >
                {v.size||v.color||"Option"} {v.stock<=0?"(Out of stock)":""}
              </button>
            ))
          ) : (
            quickSizes(product).map(s=><button key={s} type="button" className={`size ${size===s?"active":""}`} onClick={()=>setSize(s)}>{s}</button>)
          )}
        </div>
        <button
          className="btn primary full"
          style={{marginTop:18}}
          disabled={busy || (availableVariants.length>0 && !selectedVariantId)}
          onClick={async()=>{
            setBusy(true);
            try{
              const customisation = selectedVariantId ? { variantId: selectedVariantId } : (size ? { size } : undefined);
              await add(product.id, 1, customisation);
              onClose();
              openDrawer();
            }finally{
              setBusy(false);
            }
          }}
        >
          <ShoppingBag size={15}/>{busy?"Adding…":"Add to bag"}
        </button>
        <Link href={`/product/${product.slug}`} className="btn full" style={{marginTop:8}} onClick={onClose}>View full details</Link>
      </div>
    </div>
  </>;
}
