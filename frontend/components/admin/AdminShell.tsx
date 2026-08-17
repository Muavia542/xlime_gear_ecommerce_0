"use client";
import { useEffect,useMemo,useRef,useState } from "react";
import { useRouter,usePathname } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { adminApi,pretty } from "@/lib/admin";
import { Search,Plus,Bell,Sun,Moon,Menu,X,ChevronDown,LogOut,ExternalLink,Package,LayoutDashboard,Tags,Boxes,Warehouse,Images,ShoppingBag,UsersRound,Palette,FileCheck2,UserRound,PanelTop,BarChart3,Activity,ShieldCheck,Settings,ContactRound,Megaphone,LineChart,ClipboardList,ArrowUpRight,Command,FileText,Shirt } from "lucide-react";

const groups=[
 {title:"Overview",items:[{href:"/admin",label:"Command Center",icon:LayoutDashboard}]},
 {title:"Catalog",items:[{href:"/admin/products",label:"Products",icon:Package},{href:"/admin/categories",label:"Categories",icon:Tags},{href:"/admin/collections",label:"Collections",icon:Boxes},{href:"/admin/inventory",label:"Inventory",icon:Warehouse},{href:"/admin/media",label:"Media Library",icon:Images}]},
 {title:"Orders & Requests",items:[{href:"/admin/orders",label:"Orders",icon:ShoppingBag},{href:"/admin/team-orders",label:"Team Orders",icon:UsersRound},{href:"/admin/custom-kits",label:"Custom Kits",icon:Palette},{href:"/admin/quotes",label:"Quotes & Approvals",icon:FileCheck2}]},
 {title:"Customers",items:[{href:"/admin/customers",label:"Customers",icon:UserRound},{href:"/admin/team-accounts",label:"Team Accounts",icon:ContactRound}]},
 {title:"Marketing",items:[{href:"/admin/banner",label:"Announcement Banner",icon:Megaphone},{href:"/admin/campaigns",label:"Campaigns",icon:PanelTop}]},
 {title:"Analytics",items:[{href:"/admin/analytics/performance",label:"Performance",icon:BarChart3},{href:"/admin/analytics/products",label:"Product Insights",icon:LineChart},{href:"/admin/analytics/requests",label:"Request Insights",icon:ClipboardList}]},
 {title:"System",items:[{href:"/admin/notifications",label:"Notifications",icon:Bell},{href:"/admin/audit-log",label:"Audit Log",icon:Activity},{href:"/admin/admin-users",label:"Admin Users",icon:ShieldCheck},{href:"/admin/settings",label:"Store Settings",icon:Settings}]},
];

type SearchGroups={products:any[];orders:any[];teamOrders:any[];customKits:any[];customers:any[];quotes:any[]};
const emptySearch:SearchGroups={products:[],orders:[],teamOrders:[],customKits:[],customers:[],quotes:[]};
const searchConfig=[
 {key:"products" as const,label:"Products",icon:Package,href:(x:any)=>`/admin/products/${x.id}/edit`,primary:(x:any)=>x.name,secondary:(x:any)=>x.sku||pretty(x.status)},
 {key:"orders" as const,label:"Orders",icon:ShoppingBag,href:(x:any)=>`/admin/orders/${x.id}`,primary:(x:any)=>x.orderNumber,secondary:(x:any)=>`${x.customerName} • ${pretty(x.status)}`},
 {key:"teamOrders" as const,label:"Team Orders",icon:UsersRound,href:(x:any)=>`/admin/team-orders/${x.id}`,primary:(x:any)=>x.organisation,secondary:(x:any)=>`${x.requestNumber} • ${pretty(x.stage)}`},
 {key:"customKits" as const,label:"Custom Kits",icon:Shirt,href:(x:any)=>`/admin/custom-kits/${x.id}`,primary:(x:any)=>x.teamName||x.requestNumber,secondary:(x:any)=>`${x.requestNumber} • ${pretty(x.stage)}`},
 {key:"customers" as const,label:"Customers",icon:UserRound,href:(x:any)=>`/admin/customers/${x.id}`,primary:(x:any)=>x.name,secondary:(x:any)=>x.email},
 {key:"quotes" as const,label:"Quotes",icon:FileText,href:(x:any)=>`/admin/quotes/${x.id}`,primary:(x:any)=>x.quoteNumber,secondary:(x:any)=>`${x.customerName} • ${pretty(x.status)}`},
];

export default function AdminShell({children}:{children:React.ReactNode}){
 const {user,loading,logout}=useAuth(); const {theme,toggle}=useTheme(); const router=useRouter(); const path=usePathname();
 const [mobile,setMobile]=useState(false); const [profile,setProfile]=useState(false); const [noticeOpen,setNoticeOpen]=useState(false); const [notifications,setNotifications]=useState<any[]>([]); const [unread,setUnread]=useState(0); const [search,setSearch]=useState(""); const [searchGroups,setSearchGroups]=useState<SearchGroups>(emptySearch); const [searchOpen,setSearchOpen]=useState(false); const [searchBusy,setSearchBusy]=useState(false);
 const searchWrap=useRef<HTMLDivElement>(null); const searchInput=useRef<HTMLInputElement>(null); const topActions=useRef<HTMLDivElement>(null); const quickDetails=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{if(!loading&&(!user||user.role!=="ADMIN"))router.replace("/login?next=/admin")},[user,loading,router]);
 useEffect(()=>{if(user?.role==="ADMIN")adminApi.get<any>("/notifications").then(r=>{setNotifications(r.notifications||[]);setUnread(r.unread||0)}).catch(()=>{})},[user]);
 useEffect(()=>{setMobile(false);setProfile(false);setNoticeOpen(false);setSearchOpen(false);if(quickDetails.current)quickDetails.current.open=false},[path]);
 useEffect(()=>{const q=search.trim();if(q.length<2){setSearchGroups(emptySearch);setSearchOpen(false);return}const timer=setTimeout(()=>{setSearchBusy(true);adminApi.get<any>(`/search?q=${encodeURIComponent(q)}`).then(r=>{setSearchGroups(r.groups||emptySearch);setSearchOpen(true)}).catch(()=>setSearchGroups(emptySearch)).finally(()=>setSearchBusy(false))},220);return()=>clearTimeout(timer)},[search]);
 useEffect(()=>{const close=(e:MouseEvent)=>{if(searchWrap.current&&!searchWrap.current.contains(e.target as Node))setSearchOpen(false)};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[]);
 useEffect(()=>{const close=(e:MouseEvent)=>{if(topActions.current&&!topActions.current.contains(e.target as Node)){setProfile(false);setNoticeOpen(false)}};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[]);
 useEffect(()=>{const close=(e:MouseEvent)=>{const details=quickDetails.current;if(details?.open&&!details.contains(e.target as Node))details.open=false};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[]);
 useEffect(()=>{const shortcut=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput.current?.focus();setSearchOpen(search.trim().length>=2)}if(e.key==="Escape"){setSearchOpen(false);setProfile(false);setNoticeOpen(false);if(quickDetails.current)quickDetails.current.open=false}};document.addEventListener("keydown",shortcut);return()=>document.removeEventListener("keydown",shortcut)},[search]);
 const firstResult=useMemo(()=>searchConfig.flatMap(c=>(searchGroups[c.key]||[]).map(x=>c.href(x)))[0]||"",[searchGroups]);
 if(loading||!user||user.role!=="ADMIN")return <div className="adm-access"><BrandLogo className="adm-auth-logo" width={170} height={134} priority/><span>Securing Operations Hub…</span></div>;
 const doLogout=async()=>{await logout();router.replace("/login")};
 const markAll=async()=>{await adminApi.post("/notifications/read-all");setUnread(0);setNotifications(v=>v.map(n=>({...n,isRead:true})))};
 const totalResults=searchConfig.reduce((n,c)=>n+(searchGroups[c.key]?.length||0),0);
 return <div className="adm-shell">
   <aside className={`adm-sidebar ${mobile?"open":""}`}>
    <div className="adm-brand"><Link href="/admin"><BrandLogo className="adm-brand-logo" width={150} height={118} priority alt="XLIME GEAR Operations Hub"/></Link><button onClick={()=>setMobile(false)} className="adm-mobile-close" aria-label="Close navigation"><X/></button><span>OPERATIONS HUB</span></div>
    <nav aria-label="Admin navigation">{groups.map(g=><div className="adm-nav-group" key={g.title}><b>{g.title}</b>{g.items.map(it=>{const Icon=it.icon;const active=it.href==="/admin"?path==="/admin":path.startsWith(it.href);return <Link key={it.href} href={it.href} className={active?"active":""}><Icon size={17}/><span>{it.label}</span></Link>})}</div>)}</nav>
    <div className="adm-sidebar-foot"><Link href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/>View Storefront</Link><button onClick={doLogout}><LogOut size={16}/>Log out</button></div>
   </aside>
   {mobile&&<button className="adm-scrim" onClick={()=>setMobile(false)} aria-label="Close menu"/>}
   <div className="adm-workspace">
    <header className="adm-topbar">
      <button className="adm-menu" onClick={()=>setMobile(true)} aria-label="Open menu"><Menu size={20}/></button>
      <div className="adm-search-wrap" ref={searchWrap}>
       <form className="adm-global-search" onSubmit={e=>{e.preventDefault();if(firstResult)router.push(firstResult)}} role="search"><Search size={17}/><input ref={searchInput} value={search} onFocus={()=>search.trim().length>=2&&setSearchOpen(true)} onChange={e=>setSearch(e.target.value)} placeholder="Search products, orders, teams, quotes…" aria-label="Search administration"/><kbd><Command size={11}/> K</kbd></form>
       {searchOpen&&<div className="adm-search-results" role="listbox" aria-label="Admin search results">{searchBusy?<div className="adm-search-message">Searching Operations Hub…</div>:totalResults===0?<div className="adm-search-message">No matching records found.</div>:searchConfig.map(group=>{const rows=searchGroups[group.key]||[];if(!rows.length)return null;const Icon=group.icon;return <section key={group.key}><header><Icon size={13}/>{group.label}<span>{rows.length}</span></header>{rows.map((x:any)=><Link href={group.href(x)} key={`${group.key}-${x.id}`}><div><b>{group.primary(x)}</b><small>{group.secondary(x)}</small></div><ArrowUpRight size={13}/></Link>)}</section>})}</div>}
      </div>
      <div className="adm-top-actions" ref={topActions}>
       <details ref={quickDetails} className="adm-quick-details">
        <summary className="adm-quick" aria-label="Open Quick Add menu"><Plus size={16}/> <span>Quick Add</span></summary>
        <div className="adm-quick-menu-native" id="admin-quick-add-menu" role="menu">
         <Link role="menuitem" href="/admin/products/new" onClick={()=>{if(quickDetails.current)quickDetails.current.open=false}}>New product</Link>
         <Link role="menuitem" href="/admin/quotes/new" onClick={()=>{if(quickDetails.current)quickDetails.current.open=false}}>Create quote</Link>
         <Link role="menuitem" href="/admin/team-orders/new" onClick={()=>{if(quickDetails.current)quickDetails.current.open=false}}>Create team order</Link>
         <Link role="menuitem" href="/admin/custom-kits/new" onClick={()=>{if(quickDetails.current)quickDetails.current.open=false}}>Create custom kit request</Link>
         <Link role="menuitem" href="/admin/categories" onClick={()=>{if(quickDetails.current)quickDetails.current.open=false}}>Manage category</Link>
        </div>
       </details>
       <div className="adm-pop-wrap"><button className="adm-icon-btn" onClick={()=>setNoticeOpen(v=>!v)} aria-label={`Notifications${unread?`, ${unread} unread`:""}`} aria-expanded={noticeOpen}><Bell size={18}/>{unread>0&&<em>{unread>9?"9+":unread}</em>}</button>{noticeOpen&&<div className="adm-pop notifications"><header><strong>Notifications</strong><button onClick={markAll}>Mark all read</button></header>{notifications.slice(0,5).map(n=><div className={n.isRead?"read":""} key={n.id}><b>{n.title}</b><p>{n.message}</p></div>)}<Link href="/admin/notifications">Open notification centre</Link></div>}</div>
       <button className="adm-icon-btn" onClick={toggle} aria-label={theme==="dark"?"Switch to light theme":"Switch to dark theme"} title={theme==="dark"?"Light theme":"Dark theme"}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
       <div className="adm-pop-wrap"><button className="adm-profile" onClick={()=>setProfile(v=>!v)} aria-expanded={profile}><span aria-hidden="true">{user.name?.slice(0,1)||"A"}</span><div><b>{user.name||"Admin"}</b><small>{user.email}</small></div><ChevronDown size={14}/></button>{profile&&<div className="adm-pop profile"><Link href="/admin/admin-users">Admin access</Link><Link href="/admin/settings">Store settings</Link><button onClick={doLogout}>Log out</button></div>}</div>
      </div>
    </header>
    <main className="adm-main">{children}</main>
   </div>
 </div>
}