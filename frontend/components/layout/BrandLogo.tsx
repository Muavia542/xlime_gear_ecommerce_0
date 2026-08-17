import Image from "next/image";
export default function BrandLogo({className="logo-img",priority=false,width=150,height=118,alt="XLIME GEAR official logo"}:{className?:string;priority?:boolean;width?:number;height?:number;alt?:string}){
 return <span className={`${className}-wrap brand-logo-wrap`} aria-label={alt}>
   <Image className={`${className} brand-logo-dark`} src="/images/official/xlime_official_logo_dark.png" alt={alt} width={width} height={height} priority={priority}/>
   <Image className={`${className} brand-logo-light`} src="/images/official/xlime_official_logo_light.png" alt="" aria-hidden="true" width={width} height={height} priority={priority}/>
 </span>;
}
