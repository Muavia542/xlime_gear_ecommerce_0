import { api } from "./api";

export const adminApi = {
  get: <T=any>(path:string) => api<T>(`/admin/v2${path}`),
  post: <T=any>(path:string, body?:unknown) => api<T>(`/admin/v2${path}`, {method:"POST",body:body===undefined?undefined:JSON.stringify(body)}),
  put: <T=any>(path:string, body?:unknown) => api<T>(`/admin/v2${path}`, {method:"PUT",body:body===undefined?undefined:JSON.stringify(body)}),
  patch: <T=any>(path:string, body?:unknown) => api<T>(`/admin/v2${path}`, {method:"PATCH",body:body===undefined?undefined:JSON.stringify(body)}),
  del: <T=any>(path:string) => api<T>(`/admin/v2${path}`, {method:"DELETE"}),
};
export const pretty = (value:string="") => value.replaceAll("_"," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
export const fmtDate = (value?:string|Date|null) => value ? new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(value)) : "—";
export const fmtDateTime = (value?:string|Date|null) => value ? new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(value)) : "—";
export const fmtMoney = (pence?:number|null) => pence==null ? "—" : new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(pence/100);
