import { CartProduct, Product } from "@/types/Product";

export const normalizeCartProduct = (
  product: Product | CartProduct,
  options?: {
    quantity?: number;
    size?: string;
    color?: string;
    sku?: string;
    custom_message?: string;
  }
): CartProduct => {
  return {
    id: product.id,
    name: product.name,
    on_sale: product.on_sale ?? false,
    sale_price: product.sale_price ?? 0,
    price: product.price,
    thumbnail: product.thumbnail,
    sku: options?.sku ?? product.sku,
    quantity: options?.quantity ?? 1,
    custom_messsage: options?.custom_message,
    ...(options?.size && { size: options.size }),
    ...(options?.color && { color: options.color }),
  };
};