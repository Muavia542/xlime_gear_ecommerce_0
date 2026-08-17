import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { assetUrl } from "@/lib/api";
export default function CategoryGrid({categories}:{categories:Category[]}){return <div className="category-grid">{categories.map(c=><Link className="category-card" href={`/shop/${c.slug}`} key={c.id}><Image src={assetUrl(c.imageUrl||"/images/official/11_black_green_custom_kit.jpg")} alt={`XLIME GEAR ${c.name} category`} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 25vw" style={{objectFit:"cover"}}/><div className="category-copy"><span className="eyebrow">Shop category</span><h3>{c.name}</h3><p>{c.description}</p></div></Link>)}</div>}
