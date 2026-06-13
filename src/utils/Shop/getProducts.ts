"use cache";
import { createClient } from "@/utils/supabase/client";
import { cacheTag } from "next/cache";
import { Product } from "@/types/Product";

type SortOption =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "bestselling"
  | "name_asc"
  | "name_desc";

type FilterParams = {
  price?: string;
  scent?: string;
  size?: string;
};

export async function getProducts(
  query?: string,
  sort?: string,
  filters?: FilterParams,
) {
  cacheTag("products");
  const supabase = createClient();

  let queryBuilder = supabase.from("products").select("*");

  // Apply search filter
  if (query?.trim()) {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`);
  }

  // Apply sorting (before filtering, for better performance)
  if (sort) {
    switch (sort as SortOption) {
      case "price_asc":
        queryBuilder = queryBuilder.order("price", { ascending: true });
        break;
      case "price_desc":
        queryBuilder = queryBuilder.order("price", { ascending: false });
        break;
      case "newest":
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
        break;
      case "bestselling":
        queryBuilder = queryBuilder.order("sales_count", { ascending: false });
        break;
      case "name_asc":
        queryBuilder = queryBuilder.order("name", { ascending: true });
        break;
      case "name_desc":
        queryBuilder = queryBuilder.order("name", { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
    }
  } else {
    queryBuilder = queryBuilder.order("created_at", { ascending: false });
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  if (!data) return [];

  // Client-side filtering for variations
  let filteredProducts = data as Product[];

  // Filter by price (considering variations)
  if (filters?.price) {
    const [min, max] = filters.price.split("-").map(Number);
    filteredProducts = filteredProducts.filter((product) => {
      // Check base price
      const basePrice =
        product.on_sale && product.sale_price
          ? product.sale_price
          : product.price;

      if (basePrice >= min && basePrice <= max) return true;

      // Check variation prices
      if (product.variations && product.variations.length > 0) {
        return product.variations.some((variation) => {
          const variationPrice = variation.sale_price ?? variation.price;
          return variationPrice >= min && variationPrice <= max;
        });
      }

      return false;
    });
  }

  // Filter by size (considering variations)
  if (filters?.size) {
    const sizeFilter = filters.size;
    filteredProducts = filteredProducts.filter((product) => {
      // Check available_sizes array
      if (product.available_sizes?.includes(sizeFilter)) return true;

      // Check variations
      if (product.variations && product.variations.length > 0) {
        return product.variations.some(
          (variation) => variation.size === sizeFilter,
        );
      }

      return false;
    });
  }

  // Filter by scent/tags
  if (filters?.scent) {
    filteredProducts = filteredProducts.filter((product) => {
      // Check tags array for scent
      return product.tags?.some((tag) =>
        tag.toLowerCase().includes(filters.scent!.toLowerCase()),
      );
    });
  }

  return filteredProducts;
}
