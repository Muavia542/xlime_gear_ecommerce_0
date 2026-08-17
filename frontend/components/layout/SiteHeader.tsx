"use client";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import {
  Menu, Search, UserRound, ShoppingBag, Sun, Moon, X, ChevronRight,
  Shirt, Dumbbell, BriefcaseBusiness, Sparkles, MessageCircle
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const megaGroups=[
 {title:"Sports",icon:Shirt,items:[["Uniforms","/shop/sports/football-kits"],["Football Kits","/shop/sports/football-kits"],["Basketball","/shop/sports/basketball"],["Volleyball","/shop/sports/volleyball"],["Training Wear","/shop/sports/training-wear"]]},
 {title:"Gym & Active",icon:Dumbbell,items:[["Sports Leggings","/shop/gym-active/sports-leggings"],["Sports Bras","/shop/gym-active/sports-bras"],["Gymwear","/shop/gym-active/gymwear"],["Activewear","/shop/gym-active/activewear"]]},
 {title:"Leather",icon:BriefcaseBusiness,items:[["Leather Jackets","/shop/leather/jackets"],["Wallets","/shop/leather/wallets"],["Belts","/shop/leather/belts"],["Leather Bags","/shop/leather/bags"]]},
 {title:"Fashion",icon:Sparkles,items:[["Hoodies","/shop/fashion/hoodies"],["T-Shirts","/shop/fashion/t-shirts"],["Joggers","/shop/fashion/joggers"],["Tracksuits","/shop/fashion/tracksuits"],["Caps","/shop/fashion/caps"]]},
] as const;

export default function SiteHeader(){
 const {theme,toggle}=useTheme();
 const {count,openDrawer}=useCart();
 const [mobile,setMobile]=useState(false);
 const [mobileSearchOpen,setMobileSearchOpen]=useState(false);
 const [mega,setMega]=useState(false);
 const [search,setSearch]=useState("");
 const router=useRouter();
 const pathname=usePathname();
 const headerRef=useRef<HTMLElement>(null);
 const mobileSearchInputRef=useRef<HTMLInputElement>(null);

 function submitSearch(e:FormEvent){
   e.preventDefault();
   if(search.trim()){
     router.push(`/shop?q=${encodeURIComponent(search.trim())}`);
     setMobileSearchOpen(false);
   }
 }

 useEffect(()=>{
   setMobile(false);
   setMega(false);
   setMobileSearchOpen(false);
 },[pathname]);

 useEffect(()=>{
   if(mobileSearchOpen){
     setTimeout(()=>mobileSearchInputRef.current?.focus(),50);
   }
 },[mobileSearchOpen]);

 useEffect(()=>{
   const handleKeyDown=(e:KeyboardEvent)=>{
     if(e.key==="Escape"){
       if(mobileSearchOpen) setMobileSearchOpen(false);
       if(mobile) setMobile(false);
       if(mega) setMega(false);
     }
   };
   document.addEventListener("keydown",handleKeyDown);
   return ()=>document.removeEventListener("keydown",handleKeyDown);
 },[mobileSearchOpen,mobile,mega]);

 useEffect(()=>{
   const close=(e:MouseEvent)=>{
     if(headerRef.current&&!headerRef.current.contains(e.target as Node)&&!(e.target as HTMLElement).closest?.(".mega")){
       setMega(false);
     }
   };
   document.addEventListener("mousedown",close);
   return()=>document.removeEventListener("mousedown",close);
 },[]);

 const active=(prefix:string)=>prefix==="/shop"?pathname==="/shop":pathname.startsWith(prefix);

 return <>
  <header ref={headerRef} className="header">
   <div className="wrap inner">
    {mobileSearchOpen ? (
      <form onSubmit={submitSearch} className="mobile-search-full-bar" role="search">
        <Search size={18} className="mobile-search-icon" aria-hidden="true" />
        <input
          ref={mobileSearchInputRef}
          type="search"
          className="mobile-search-active-input"
          placeholder="Search products..."
          aria-label="Search products"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
        <button
          type="button"
          className="mobile-search-close-btn"
          onClick={()=>{setMobileSearchOpen(false);setSearch("");}}
          aria-label="Close search"
        >
          <X size={18} />
        </button>
      </form>
    ) : (
      <>
        <button
          type="button"
          className="icon-btn mobile-toggle"
          onClick={()=>setMobile(v=>!v)}
          aria-label={mobile?"Close menu":"Open menu"}
          aria-expanded={mobile}
        >
          {mobile ? <X size={18}/> : <Menu size={18}/>}
        </button>

        <Link href="/" className="logo logo-image" aria-label="XLIME GEAR home">
          <BrandLogo className="brand-logo" priority width={140} height={86}/>
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          <Link href="/shop" className={pathname==="/shop"?"active":""} onMouseEnter={()=>setMega(true)} onFocus={()=>setMega(true)}>Shop</Link>
          <Link className={active("/shop/sports")?"active":""} href="/shop/sports">Sports</Link>
          <Link className={active("/shop/gym-active")?"active":""} href="/shop/gym-active">Gym & Active</Link>
          <Link className={active("/shop/leather")?"active":""} href="/shop/leather">Leather</Link>
          <Link className={active("/shop/fashion")?"active":""} href="/shop/fashion">Fashion</Link>
          <Link className={active("/custom-kits")?"active":""} href="/custom-kits">Custom Kits</Link>
          <Link className={active("/team-orders")?"active":""} href="/team-orders">Team Orders</Link>
        </nav>

        <form onSubmit={submitSearch} className="store-search desktop-only-search" role="search">
          <Search size={15} aria-hidden="true"/>
          <input className="search" aria-label="Search XLIME products" placeholder="Search uniforms, activewear, leather, fashion..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </form>

        <div className="icons">
          <button
            type="button"
            className="icon-btn mobile-search-trigger"
            onClick={()=>setMobileSearchOpen(true)}
            aria-label="Search products"
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            className="icon-btn desktop-only-icon"
            onClick={toggle}
            title="Switch light / dark theme"
            aria-label="Switch light or dark theme"
          >
            {theme==="dark"?<Sun size={17}/>:<Moon size={17}/>}
          </button>
          <Link className="icon-btn desktop-only-icon" href="/account" aria-label="Customer account">
            <UserRound size={17}/>
          </Link>
          <button
            type="button"
            className="icon-btn header-bag-btn"
            onClick={openDrawer}
            aria-label={`Open shopping bag with ${count} items`}
          >
            <ShoppingBag size={17}/>
            {count>0&&<span className="badge">{count}</span>}
          </button>
        </div>

        <Link className="btn primary sm header-cta desktop-only-cta" href="/custom-kits">
          Design your kit
        </Link>
      </>
    )}
   </div>
  </header>

  <div className={`mega ${mega?"show":""}`} onMouseEnter={()=>setMega(true)} onMouseLeave={()=>setMega(false)}>
   <div className="mega-grid xlime-mega-grid">
    {megaGroups.map(g=>{const Icon=g.icon;return <div key={g.title}><h4><Icon size={15}/> {g.title}</h4>{g.items.map(([label,href])=><Link href={href} key={label}>{label}</Link>)}</div>})}
    <div className="mega-promo xlime-mega-promo"><BrandLogo className="mega-brand-logo" width={120} height={76}/><div><span className="eyebrow">New arrival</span><h3 className="display">XLIME Football Kit</h3><Link className="btn primary sm" href="/product/xlime-football-custom-kit">View new arrival</Link></div></div>
   </div>
  </div>

  <nav className={`mobile-menu ${mobile?"show":""}`} aria-label="Mobile navigation">
    <div className="mobile-menu-links">
      {[['Shop All','/shop'],['Sports & Uniforms','/shop/sports'],['Gym & Active','/shop/gym-active'],['Leather','/shop/leather'],['Fashion','/shop/fashion'],['Custom Kits','/custom-kits'],['Team Orders','/team-orders']].map(([label,href])=><Link key={href} href={href} onClick={()=>setMobile(false)}>{label}<ChevronRight size={17}/></Link>)}
      
      <div className="mobile-menu-secondary">
        <Link href="/account" onClick={()=>setMobile(false)} className="mobile-menu-sec-link">
          <span style={{display:"flex",alignItems:"center",gap:10}}><UserRound size={16}/> My Account</span>
          <ChevronRight size={16}/>
        </Link>
        <button type="button" className="mobile-menu-theme-btn" onClick={toggle}>
          <span style={{display:"flex",alignItems:"center",gap:10}}>
            {theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}
            <span>Theme: {theme==="dark"?"Dark Mode":"Light Mode"}</span>
          </span>
          <span className="mobile-theme-pill">{theme==="dark"?"Dark":"Light"}</span>
        </button>
        <a href="https://wa.me/447510926711" target="_blank" rel="noopener noreferrer" className="mobile-menu-sec-link">
          <span style={{display:"flex",alignItems:"center",gap:10}}><MessageCircle size={16}/> WhatsApp Support</span>
          <ChevronRight size={16}/>
        </a>
      </div>
    </div>
  </nav>
 </>;
}
