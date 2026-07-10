import { MetadataRoute } from "next";
import { getProducts } from "@/utils/Shop/getProducts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products
  const products = await getProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://www.candlecowbar.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.candlecowbar.com/shop",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.candlecowbar.com/reservations",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.candlecowbar.com/privacy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.candlecowbar.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Add dynamic product pages (if you have individual product routes)
  const productRoutes: MetadataRoute.Sitemap =
    products?.map((product) => ({
      url: `https://www.candlecowbar.com/products/${product.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  return [...staticRoutes, ...productRoutes];
}
