import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFrame from "@/components/layout/SiteFrame";
import ProductCard from "@/components/products/ProductCard";
import { serverApi,siteUrl } from "@/lib/server-api";
import { slugifyPath } from "@/lib/seo";
import type { Category,Product } from "@/lib/types";
import { jsonLd } from "@/lib/jsonld";

async function getData(categorySlug:string,subcategorySlug:string){
 try{
  const [c,p]=await Promise.all([serverApi<{categories:Category[]}>("/products/categories"),serverApi<{products:Product[]}>(`/products?category=${encodeURIComponent(categorySlug)}`)]);
  const category=c.categories.find(x=>x.slug===categorySlug)||null;
  if(!category)return {category:null,subcategory:null,products:[] as Product[]};
  const subcategory=(category.subcategories||[]).find(x=>slugifyPath(x)===subcategorySlug)||null;
  return {category,subcategory,products:subcategory?p.products.filter(x=>x.subcategory===subcategory):[]};
 }catch{return {category:null,subcategory:null,products:[] as Product[]};}
}

export async function generateMetadata({params}:{params:Promise<{category:string;subcategory:string}>}):Promise<Metadata>{
 const {category,subcategory}=await params; const d=await getData(category,subcategory); if(!d.category||!d.subcategory)return {title:"Collection Not Found",robots:{index:false,follow:false}};
 const title=`${d.subcategory} ${d.category.name} | XLIME GEAR`; const description=`Explore XLIME GEAR ${d.subcategory.toLowerCase()} from our ${d.category.name} range. Premium performance apparel with custom and team-order support.`;
 return {title:{absolute:title},description,alternates:{canonical:`/shop/${category}/${subcategory}`},openGraph:{title,description,url:`${siteUrl}/shop/${category}/${subcategory}`,images:d.products[0]?[{url:d.products[0].imageUrl,alt:d.products[0].altText||d.products[0].name}]:[]}};
}

export default async function SubcategoryPage({params}:{params:Promise<{category:string;subcategory:string}>}){
 const {category,subcategory}=await params; const d=await getData(category,subcategory); if(!d.category||!d.subcategory)notFound();
 const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:siteUrl},{"@type":"ListItem",position:2,name:"Shop",item:`${siteUrl}/shop`},{"@type":"ListItem",position:3,name:d.category.name,item:`${siteUrl}/shop/${d.category.slug}`},{"@type":"ListItem",position:4,name:d.subcategory,item:`${siteUrl}/shop/${d.category.slug}/${subcategory}`}]};
 const itemList={"@context":"https://schema.org","@type":"ItemList",name:`XLIME GEAR ${d.subcategory}`,numberOfItems:d.products.length,itemListElement:d.products.slice(0,20).map((p,i)=>({"@type":"ListItem",position:i+1,url:`${siteUrl}/product/${p.slug}`,name:p.name}))};
 return <SiteFrame><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumb)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(itemList)}}/><div className="page-hero"><div className="wrap"><div className="breadcrumbs">Home › Shop › <Link href={`/shop/${d.category.slug}`}>{d.category.name}</Link> › {d.subcategory}</div><h1 className="page-title">{d.subcategory}</h1><p className="muted" style={{maxWidth:720}}>Premium {d.subcategory.toLowerCase()} from XLIME GEAR, built around performance, comfort and team identity. Contact us for customisation and team quantities.</p></div></div><section className="section"><div className="wrap"><div className="grid-products">{d.products.map(p=><ProductCard key={p.id} product={p}/>)}</div>{!d.products.length&&<p>No active products are currently available.</p>}</div></section></SiteFrame>;
}
