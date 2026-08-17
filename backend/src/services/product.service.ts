import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";

async function publicPricingEnabled(){
  const setting=await prisma.storeSetting.findUnique({where:{key:"showPublicPrices"}}).catch(()=>null);
  return setting?.value===true;
}
function publicProduct<T extends {showPrice:boolean;pricePence:number|null}>(product:T,globalEnabled:boolean){
  return globalEnabled && product.showPrice && product.pricePence != null ? product : {...product,showPrice:false,pricePence:null};
}

export const productService = {
  list: async (category?: string, search?: string) => {
    const [products,pricing]=await Promise.all([
      prisma.product.findMany({
        take: 200,
        where: {
          status: "ACTIVE",
          ...(category ? { category: { slug: category } } : {}),
          ...(search ? { OR: [{ name: { contains: search } }, { subcategory: { contains: search } }, { shortDescription: { contains: search } }, { sport:{contains:search} }] } : {})
        },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: { where: { isActive: true } }
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
      }),
      publicPricingEnabled()
    ]);
    return products.map(p=>publicProduct(p,pricing));
  },
  bySlug: async (slug: string) => {
    const [product,pricing]=await Promise.all([
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: { where: { isActive: true } }
        }
      }),
      publicPricingEnabled()
    ]);
    if (!product || product.status !== "ACTIVE") throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found.");
    return publicProduct(product,pricing);
  }
};
