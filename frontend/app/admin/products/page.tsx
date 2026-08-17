"use client";
import { useEffect,useMemo,useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus,Copy,Archive,Edit3,PackageSearch } from "lucide-react";
import { api,assetUrl } from "@/lib/api";
import { AdminPageHeader,MetricCard,Panel,StatusBadge,SearchBox,EmptyState,LoadingState } from "@/components/admin/AdminUI";

export default function AdminProductsPage(){
 const sp=useSearchParams(); const [products,setProducts]=useState<any[]>([]);const[loading,setLoading]=useState(true);const[search,setSearch]=useState(sp.get("q")||"");const[status,setStatus]=useState("ALL");const[category,setCategory]=useState("ALL");
 const load=()=>{setLoading(true);return api<any>("/admin/products").then(r=>setProducts(r.products||[])).finally(()=>setLoading(false))};useEffect(()=>{void load()},[]);
 const filtered=useMemo(()=>products.filter(p=>{const q=search.toLowerCase();return(!q||`${p.name} ${p.sku||""} ${p.subcategory} ${p.category?.name}`.toLowerCase().includes(q))&&(status==="ALL"||p.status===status)&&(category==="ALL"||p.category?.name===category)}),[products,search,status,category]);
 const cats=[...new Set(products.map(p=>p.category?.name).filter(Boolean))];
 const counts={total:products.length,active:products.filter(p=>p.status==="ACTIVE").length,draft:products.filter(p=>p.status==="DRAFT").length,archived:products.filter(p=>p.status==="ARCHIVED").length,featured:products.filter(p=>p.featured).length};
 const archive=async(id:string)=>{if(!confirm("Archive this product? It can remain in the database without appearing on the storefront."))return;await api(`/admin/products/${id}`,{method:"DELETE"});load()};
 const duplicate=async(id:string)=>{await api(`/admin/products/${id}/duplicate`,{method:"POST"});load()};
 return <>
  <AdminPageHeader title="Product Catalog" description="Manage XLIME products, customisable ranges, visibility and catalog health." actions={<Link className="adm-btn primary" href="/admin/products/new"><Plus size={15}/>Add Product</Link>}/>
  <div className="adm-grid metrics" style={{gridTemplateColumns:"repeat(5,minmax(0,1fr))"}}><MetricCard label="Total" value={counts.total}/><MetricCard label="Active" value={counts.active}/><MetricCard label="Draft" value={counts.draft} accent="info"/><MetricCard label="Archived" value={counts.archived} accent="danger"/><MetricCard label="Featured" value={counts.featured} accent="warning"/></div>
  <div className="adm-toolbar"><SearchBox value={search} onChange={setSearch} placeholder="Search name, SKU, category…"/><select className="adm-select" value={category} onChange={e=>setCategory(e.target.value)}><option>ALL</option>{cats.map(c=><option key={c}>{c}</option>)}</select><select className="adm-select" value={status} onChange={e=>setStatus(e.target.value)}><option>ALL</option><option>ACTIVE</option><option>DRAFT</option><option>ARCHIVED</option></select></div>
  <Panel title="Products" subtitle={`${filtered.length} matching records`}>
   {loading?<LoadingState/>:<div className="adm-table-wrap mobile-cards"><table className="adm-table"><thead><tr><th>Product</th><th>Category</th><th>Sport</th><th>Stock</th><th>Status</th><th>Custom</th><th>Actions</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><div className="adm-product-cell"><img src={assetUrl(p.imageUrl)} alt={p.altText||p.name}/><div><b>{p.name}</b><small>{p.sku||p.slug}</small></div></div></td><td>{p.category?.name}<small style={{display:"block",color:"var(--adm-muted)"}}>{p.subcategory}</small></td><td>{p.sport||"—"}</td><td>{p.stockQuantity??0}</td><td><StatusBadge value={p.status}/></td><td>{p.isCustomizable?"Yes":"No"}</td><td><div style={{display:"flex",gap:5}}><Link className="adm-icon-btn" href={`/admin/products/${p.id}/edit`} aria-label="Edit"><Edit3 size={14}/></Link><button className="adm-icon-btn" onClick={()=>duplicate(p.id)} aria-label="Duplicate"><Copy size={14}/></button><button className="adm-icon-btn" onClick={()=>archive(p.id)} aria-label="Archive"><Archive size={14}/></button></div></td></tr>)}</tbody></table><div className="adm-mobile-card-list">{filtered.map(p=><article className="adm-mobile-record" key={p.id}><header><b>{p.name}</b><StatusBadge value={p.status}/></header><p>{p.category?.name} • {p.subcategory} • Stock {p.stockQuantity??0}</p><Link className="adm-row-link" href={`/admin/products/${p.id}/edit`}>Edit product</Link></article>)}</div>{!filtered.length&&<EmptyState title="No products match" text="Change filters or add a new XLIME product."/>}</div>}
  </Panel>
 </>
}
