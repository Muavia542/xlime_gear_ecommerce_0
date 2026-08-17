import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./storefront-approved.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { jsonLd } from "@/lib/jsonld";
import { serverApi } from "@/lib/server-api";

const barlow=Barlow_Condensed({subsets:["latin"],weight:["600","700","800"],variable:"--font-barlow",display:"swap"});
const manrope=Manrope({subsets:["latin"],weight:["400","500","600","700","800"],variable:"--font-manrope",display:"swap"});
const space=Space_Grotesk({subsets:["latin"],weight:["500","600","700"],variable:"--font-space",display:"swap"});
const base=process.env.NEXT_PUBLIC_SITE_URL||"https://xlimegear.com";
const defaultTitle="XLIME GEAR | Custom Sportswear, Activewear & Team Kits";
const defaultDescription="XLIME GEAR creates premium custom team kits, sportswear, activewear, leather goods and fashion for clubs, teams and individuals.";

export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:[{media:"(prefers-color-scheme: dark)",color:"#080A08"},{media:"(prefers-color-scheme: light)",color:"#F4F6F1"}],colorScheme:"dark light"};

export async function generateMetadata():Promise<Metadata>{
 let seo:any={};
 try{const r=await serverApi<any>("/content/settings",{next:{revalidate:600}} as any);seo=r.settings?.seo||{}}catch{}
 const title=seo.defaultTitle||defaultTitle;const description=seo.defaultDescription||defaultDescription;
 return {
  metadataBase:new URL(base),title:{default:title,template:"%s | XLIME GEAR"},description,applicationName:"XLIME GEAR",
  keywords:["XLIME GEAR","custom team kits","custom sportswear","sports leggings","sports bras","team uniforms","activewear","football kits","basketball uniforms","custom apparel"],
  alternates:{canonical:"/"},openGraph:{type:"website",siteName:"XLIME GEAR",url:base,title,description,images:[{url:"/images/official/xlime-og.jpg",width:1200,height:630,alt:"XLIME GEAR official branding"}]},
  twitter:{card:"summary_large_image",title:"XLIME GEAR",description,images:["/images/official/xlime-og.jpg"]},icons:{icon:"/images/official/xlime-app-icon.png",apple:"/images/official/xlime-app-icon.png"},category:"sportswear",
 };
}

const orgJsonLd={"@context":"https://schema.org","@type":"Organization",name:"XLIME GEAR",url:base,logo:`${base}/images/official/xlime_official_logo_dark.png`,email:"info@xlimegear.com",sameAs:["https://www.instagram.com/xlimegear"],contactPoint:[{"@type":"ContactPoint",telephone:"+44 7510 926711",contactType:"customer service",availableLanguage:["English"]}]};
const websiteJsonLd={"@context":"https://schema.org","@type":"WebSite",name:"XLIME GEAR",url:base,potentialAction:{"@type":"SearchAction",target:{"@type":"EntryPoint",urlTemplate:`${base}/shop?q={search_term_string}`},"query-input":"required name=search_term_string"}};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" data-scroll-behavior="smooth" className={`${barlow.variable} ${manrope.variable} ${space.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(orgJsonLd)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(websiteJsonLd)}}/><ThemeProvider><AuthProvider><CartProvider>{children}</CartProvider></AuthProvider></ThemeProvider></body></html>}
