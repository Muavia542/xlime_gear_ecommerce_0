export function slugifyPath(value:string){return value.toLowerCase().trim().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
export function humaniseSlug(value:string){return value.split("-").filter(Boolean).map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(" ")}
export function formatGBP(pence?:number|null){return pence==null?null:new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(pence/100)}
