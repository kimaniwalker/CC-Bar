import { ProductWithOptions } from "@/types/Product";
import { createClient } from "../supabase/server";

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
): Promise<ProductWithOptions[]> {
  const supabase = await createClient();

  let queryBuilder = supabase.from("products").select(`
      *,
      product_option_groups (
        *,
        product_options (*)
      )
    `);

  // Apply search filter
  if (query?.trim()) {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`);
  }

  // Apply sorting
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

  let filteredProducts = data as ProductWithOptions[];

  // Filter by price (base price only)
  if (filters?.price) {
    const [min, max] = filters.price.split("-").map(Number);
    filteredProducts = filteredProducts.filter((product) => {
      // Get base price (starting price before options)
      const basePrice =
        product.on_sale && product.sale_price
          ? product.sale_price
          : product.price;

      // Only check if base price is within range
      return basePrice / 100 >= min && basePrice / 100 <= max;
    });
  }

  // Filter by size (checking product options)
  if (filters?.size) {
    const sizeFilter = filters.size.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      // Check if there's a "Size" option group
      const sizeGroup = product.product_option_groups?.find(
        (group) => group.name.toLowerCase() === "size",
      );

      if (sizeGroup) {
        return sizeGroup.product_options.some((option) =>
          option.name.toLowerCase().includes(sizeFilter),
        );
      }

      return false;
    });
  }

  // Filter by scent (checking tags or scent option group)
  if (filters?.scent) {
    const scentFilter = filters.scent.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      // Check tags array for scent
      if (
        product.tags?.some((tag) => tag.toLowerCase().includes(scentFilter))
      ) {
        return true;
      }

      // Check if there's a "Scent" option group
      const scentGroup = product.product_option_groups?.find(
        (group) => group.name.toLowerCase() === "fragrance",
      );

      if (scentGroup) {
        return scentGroup.product_options.some((option) =>
          option.name.toLowerCase().includes(scentFilter),
        );
      }

      return false;
    });
  }

  return filteredProducts;
}
