"use client";
import { createContext,useContext,useEffect,useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";
const C=createContext<any>(null);
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true);
 const refresh=async()=>{try{const r=await api<{user:User|null}>("/auth/me");setUser(r.user)}catch{setUser(null)}finally{setLoading(false)}};
 useEffect(()=>{refresh()},[]);
 const login=async(email:string,password:string)=>{const r=await api<{user:User}>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});setUser(r.user);return r.user};
 const logout=async()=>{try{await api("/auth/logout",{method:"POST"})}finally{setUser(null)}};
 return <C.Provider value={{user,loading,refresh,login,logout}}>{children}</C.Provider>;
}
export const useAuth=()=>useContext(C);
