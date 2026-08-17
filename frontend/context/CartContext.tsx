"use client";
import { createContext,useContext,useEffect,useState } from "react";
import { api } from "@/lib/api";
import type { Cart } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
const C=createContext<any>(null);
export function CartProvider({children}:{children:React.ReactNode}){
 const {user}=useAuth(); const [cart,setCart]=useState<Cart|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<string|null>(null);
 const [isDrawerOpen,setIsDrawerOpen]=useState(false);
 const openDrawer=()=>setIsDrawerOpen(true);
 const closeDrawer=()=>setIsDrawerOpen(false);
 const toggleDrawer=()=>setIsDrawerOpen(v=>!v);
 const refresh=async()=>{try{setError(null);const r=await api<{cart:Cart}>("/cart");setCart(r.cart)}catch(e:any){setError(e?.message||"Unable to load cart");setCart(null)}finally{setLoading(false)}};
 useEffect(()=>{refresh()},[user?.id]);
 const add=async(productId:string,quantity=1,customisation?:unknown)=>{const r=await api<{cart:Cart}>("/cart/items",{method:"POST",body:JSON.stringify({productId,quantity,customisation})});setCart(r.cart)};
 const update=async(itemId:string,quantity:number)=>{const r=await api<{cart:Cart}>(`/cart/items/${itemId}`,{method:"PATCH",body:JSON.stringify({quantity})});setCart(r.cart)};
 const remove=async(itemId:string)=>{const r=await api<{cart:Cart}>(`/cart/items/${itemId}`,{method:"DELETE"});setCart(r.cart)};
 return <C.Provider value={{cart,loading,error,refresh,add,update,remove,isDrawerOpen,openDrawer,closeDrawer,toggleDrawer,count:cart?.items?.reduce((a:number,b:any)=>a+b.quantity,0)||0}}>{children}</C.Provider>;
}
export const useCart=()=>useContext(C);
