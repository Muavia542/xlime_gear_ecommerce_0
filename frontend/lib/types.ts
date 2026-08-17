export type Category={id:string;slug:string;name:string;description?:string;imageUrl?:string;sortOrder?:number;isActive?:boolean;subcategories?:string[];seoTitle?:string;seoDescription?:string;updatedAt?:string};
export type ProductImage={id:string;url:string;alt:string;sortOrder:number};
export type ProductVariant={id:string;sku:string;size?:string|null;color?:string|null;stock:number;isActive:boolean};
export type Product={id:string;slug:string;sku?:string|null;name:string;shortDescription:string;description:string;subcategory:string;sport?:string|null;gender?:string;fabric?:string|null;fit?:string|null;productType?:string;imageUrl:string;altText?:string|null;featured:boolean;isCustomizable:boolean;teamOrderEligible:boolean;showPrice:boolean;pricePence?:number|null;stockQuantity?:number|null;lowStockThreshold?:number;status:string;seoTitle?:string|null;seoDescription?:string|null;category:Category;images:ProductImage[];variants?:ProductVariant[]};
export type CartItem={id:string;quantity:number;customisation?:Record<string,unknown>;product:Product};
export type Cart={id:string;items:CartItem[]};
export type User={id:string;name:string;email:string;phone?:string;role:"CUSTOMER"|"ADMIN"};
export type Order={id:string;orderNumber:string;status:string;customerName:string;email:string;phone:string;deliveryAddress:any;notes?:string;createdAt:string;items:{id:string;productName:string;productSlug:string;imageUrl:string;quantity:number}[]};
