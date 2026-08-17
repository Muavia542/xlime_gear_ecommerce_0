const API=process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export async function api<T>(path:string, options:RequestInit={}){
  const res=await fetch(`${API}${path}`,{...options,credentials:"include",headers:{"Content-Type":"application/json",...(options.headers||{})}});
  if(!res.ok){ const body=await res.json().catch(()=>({})); throw new Error(body?.error?.message||`Request failed (${res.status})`); }
  if(res.status===204) return undefined as T;
  return res.json() as Promise<T>;
}
export function assetUrl(url:string){ if(url.startsWith("/images/")) return url; if(url.startsWith("/uploads/")) return `${API.replace(/\/api$/,"")}${url}`; return url; }
