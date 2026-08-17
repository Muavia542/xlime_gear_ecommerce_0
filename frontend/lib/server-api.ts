const SERVER_API = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export async function serverApi<T>(path:string, options:RequestInit={}){
  const res = await fetch(`${SERVER_API}${path}`, { ...options, next: { revalidate: 300, ...(options as any).next } } as any);
  if(!res.ok) throw new Error(`API ${path} failed (${res.status})`);
  return res.json() as Promise<T>;
}
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xlimegear.com";
