import type { MetadataRoute } from "next";
import { serverApi,siteUrl } from "@/lib/server-api";
import { slugifyPath } from "@/lib/seo";
import type { Category,Product } from "@/lib/types";
export const revalidate=3600;
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const now=new Date();
 const staticPages=["","/shop","/team-orders","/custom-kits"].map((p,i)=>({url:`${siteUrl}${p}`,lastModified:now,changeFrequency:(i===0?"weekly":"monthly") as "weekly"|"monthly",priority:i===0?1:.8}));
 try{
  const [p,c]=await Promise.all([serverApi<{products:Product[]}>("/products"),serverApi<{categories:Category[]}>("/products/categories")]);
  const categoryPages=c.categories.map(x=>({url:`${siteUrl}/shop/${x.slug}`,lastModified:x.updatedAt?new Date(x.updatedAt):now,changeFrequency:"weekly" as const,priority:.78}));
  const subcategoryPages=c.categories.flatMap(x=>(x.subcategories||[]).map(sub=>({url:`${siteUrl}/shop/${x.slug}/${slugifyPath(sub)}`,lastModified:x.updatedAt?new Date(x.updatedAt):now,changeFrequency:"weekly" as const,priority:.72})));
  const productPages=p.products.map(x=>({url:`${siteUrl}/product/${x.slug}`,lastModified:(x as any).updatedAt?new Date((x as any).updatedAt):now,changeFrequency:"weekly" as const,priority:.82}));
  return [...staticPages,...categoryPages,...subcategoryPages,...productPages];
 }catch{return staticPages}
}
