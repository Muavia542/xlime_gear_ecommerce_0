import SiteFrame from "@/components/layout/SiteFrame";
import ShopClient from "@/components/products/ShopClient";
import { serverApi } from "@/lib/server-api";
import type { Category,Product } from "@/lib/types";

export default async function ShopPage({searchParams}:{searchParams:Promise<{category?:string;q?:string}>}){
 const params=await searchParams; const category=params.category||""; const q=params.q||"";
 let products:Product[]=[]; let categories:Category[]=[];
 try{
   const qs=new URLSearchParams({...category?{category}:{},...q?{q}:{}}).toString();
   const [p,c]=await Promise.all([serverApi<{products:Product[]}>(`/products${qs?`?${qs}`:""}`),serverApi<{categories:Category[]}>("/products/categories")]);
   products=p.products;categories=c.categories;
 }catch{}
 return <SiteFrame><ShopClient products={products} categories={categories} category={category} q={q}/></SiteFrame>;
}
