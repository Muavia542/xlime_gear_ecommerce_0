import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{const base=process.env.NEXT_PUBLIC_SITE_URL||"https://xlimegear.com";return {rules:{userAgent:"*",allow:"/",disallow:["/admin/","/account/","/cart","/checkout","/login","/register","/order-confirmation/"]},sitemap:`${base}/sitemap.xml`,host:base}}
