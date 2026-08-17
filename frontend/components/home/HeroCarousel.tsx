"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect,useState } from "react";

const slides=[
 {k:"SPORTS & TEAM UNIFORMS",title:"Built for",accent:"every team.",p:"Football kits, basketball, volleyball and multi-sport uniforms with custom team-order support.",points:["Team uniforms","Multi-sport","Custom designs"],img:"https://images.pexels.com/photos/20615456/pexels-photo-20615456.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",pos:"65% 48%",primary:["Shop sports","/shop/sports"],secondary:["Team orders","/team-orders"],alt:"XLIME GEAR sports and team uniforms campaign"},
 {k:"XLIME GEAR FOOTBALL KIT",title:"Style. comfort.",accent:"performance.",p:"Premium football teamwear with a modern athletic fit, custom designs and premium printing & stitching options.",points:["Custom designs","Team & bulk orders","Athletic fit"],img:"https://images.pexels.com/photos/19799186/pexels-photo-19799186.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",pos:"67% 43%",primary:["View football kits","/shop/sports/football-kits"],secondary:["Design your kit","/custom-kits"],alt:"XLIME GEAR football kit campaign"},
 {k:"GYM & ACTIVE",title:"Move with",accent:"confidence.",p:"Sports leggings, sports bras and activewear designed for training, movement and everyday comfort.",points:["Sports leggings","Sports bras","Activewear"],img:"https://images.pexels.com/photos/6572566/pexels-photo-6572566.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop",pos:"64% 42%",primary:["Shop gym & active","/shop/gym-active"],secondary:["View leggings","/shop/gym-active/sports-leggings"],alt:"XLIME GEAR gym and activewear campaign"},
 {k:"LEATHER",title:"Built beyond",accent:"the pitch.",p:"Leather jackets and accessories for a clean off-pitch XLIME look, with custom enquiries available.",points:["Jackets","Wallets & belts","Leather bags"],img:"https://images.pexels.com/photos/8386443/pexels-photo-8386443.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",pos:"65% 44%",primary:["Shop leather","/shop/leather"],secondary:["Custom enquiry","https://wa.me/447510926711"],alt:"XLIME GEAR leather collection campaign"},
 {k:"FASHION / OFF-PITCH",title:"Wear the",accent:"identity.",p:"Hoodies, tees, joggers and lifestyle pieces built around the XLIME GEAR visual direction.",points:["Hoodies","T-Shirts","Joggers"],img:"https://images.pexels.com/photos/12768660/pexels-photo-12768660.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop",pos:"66% 44%",primary:["Shop fashion","/shop/fashion"],secondary:["Custom order","https://wa.me/447510926711"],alt:"XLIME GEAR fashion and off-pitch campaign"},
] as const;

export default function HeroCarousel(){
 const[i,setI]=useState(0);const[paused,setPaused]=useState(false);
 useEffect(()=>{if(paused||window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;const t=setInterval(()=>setI(v=>(v+1)%slides.length),4500);return()=>clearInterval(t)},[paused]);
 return <div className={`hero-carousel hero-v5 ${paused?"paused":""}`} aria-label="XLIME GEAR featured collections" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
  <div className="hero-slides">
   {slides.map((s,n)=><article key={s.k} className={`hero-slide ${n===i?"active":""}`} aria-hidden={n!==i} style={{"--hero-pos":s.pos} as React.CSSProperties}>
    <Image className="hero-slide-img" src={s.img} alt={s.alt} fill sizes="100vw" priority={n===0} quality={82}/><div className="hero-slide-shade"/>
    <div className="wrap hero-slide-inner"><div className="hero-slide-copy"><div className="hero-kicker">{s.k}</div>{n===0?<h1>{s.title}<br/><span>{s.accent}</span></h1>:<h2>{s.title}<br/><span>{s.accent}</span></h2>}<p>{s.p}</p><div className="hero-slide-points">{s.points.map(x=><span key={x}>{x}</span>)}</div><div className="hero-actions"><Link className="btn primary" href={s.primary[1]}>{s.primary[0]}</Link>{s.secondary[1].startsWith("http")?<a className="btn hero-secondary" href={s.secondary[1]} target="_blank" rel="noopener noreferrer">{s.secondary[0]}</a>:<Link className="btn hero-secondary" href={s.secondary[1]}>{s.secondary[0]}</Link>}</div></div></div>
   </article>)}
  </div>
  <div className="hero-carousel-bottom"><div className="hero-progress-wrap" aria-label="Hero slide progress">{slides.map((_,n)=><button key={n} className={`hero-progress-seg ${n<i?"done":""} ${n===i?"active":""}`} aria-label={`Slide ${n+1}`} onClick={()=>setI(n)}><span/></button>)}</div><div className="hero-count"><b>{String(i+1).padStart(2,"0")}</b><span>/ 05</span></div></div>
  <button className="hero-arrow hero-prev" aria-label="Previous hero slide" onClick={()=>setI(v=>(v-1+slides.length)%slides.length)}>←</button><button className="hero-arrow hero-next" aria-label="Next hero slide" onClick={()=>setI(v=>(v+1)%slides.length)}>→</button>
 </div>;
}
