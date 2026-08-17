import SiteFrame from "@/components/layout/SiteFrame";
import HomeStorefront from "@/components/home/HomeStorefront";

import { serverApi } from "@/lib/server-api";

import type {
  Category,
  Product,
} from "@/lib/types";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      serverApi<{ categories: Category[] }>(
        "/products/categories"
      ),

      serverApi<{ products: Product[] }>(
        "/products"
      ),
    ]);

    return {
      categories: categoriesResponse.categories,
      products: productsResponse.products,
    };
  } catch (error) {
    console.error(
      "Failed to load XLIME homepage data:",
      error
    );

    return {
      categories: [],
      products: [],
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <SiteFrame>
      <HomeStorefront
        categories={data.categories}
        products={data.products}
      />
    </SiteFrame>
  );
}
