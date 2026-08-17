"use client"; import { createContext,useContext,useEffect,useState } from "react";
const C=createContext({theme:"dark",toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){const [theme,setTheme]=useState("dark"); useEffect(()=>{const saved=localStorage.getItem("xlime-theme")||"dark";setTheme(saved);document.documentElement.dataset.theme=saved},[]); const toggle=()=>setTheme(v=>{const n=v==="dark"?"light":"dark";localStorage.setItem("xlime-theme",n);document.documentElement.dataset.theme=n;return n}); return <C.Provider value={{theme,toggle}}>{children}</C.Provider>}
export const useTheme=()=>useContext(C);
