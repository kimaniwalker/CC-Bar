"use server";
import { createClient } from "@/utils/supabase/client";
import { Cart } from "@/types/Cart";
import { StockError } from "@/types/Product";
import {
  formatSelectedOptions,
  getCartProductKey,
} from "@/utils/Cart/normalizeCartProduct";

export async function validateStock(cart: Cart) {
  const supabase = createClient();
  const errors: StockError[] = [];

  const formatStockError = (
    item: Cart[number],
    availableStock: number,
  ): StockError => {
    // Format selected options for display
    const optionsText = formatSelectedOptions(item);
    const displayName = optionsText
      ? `${item.name} (${optionsText})`
      : item.name;

    // Get unique cart key
    const key = getCartProductKey(item);

    if (availableStock === 0) {
      return {
        key,
        availableStock,
        errorMessage: `${displayName} is out of stock.`,
      };
    }

    return {
      key,
      availableStock,
      errorMessage: `${displayName} only has ${availableStock} left in stock.`,
    };
  };

  for (const item of cart) {
    const { data: product, error } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (error) {
      console.error(`Failed to fetch product ${item.id}:`, error.message);
      errors.push({
        isDbError: true,
        key: getCartProductKey(item),
        availableStock: 0,
        errorMessage: `Product stock could not be verified. Please try again.`,
      });
      continue;
    }

    if (!product || product.stock < item.quantity) {
      errors.push(formatStockError(item, product?.stock ?? 0));
    }
  }

  return { valid: errors.length === 0, errors };
}
