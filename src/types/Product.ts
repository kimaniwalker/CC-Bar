export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category?: string[];
  price: number;
  on_sale: boolean;
  sale_price?: number;
  stock: number;
  available_sizes?: string[];
  available_colors?: string[];
  variations?: ProductVariation[];
  tags?: string[];
  brand?: string;
  dimensions?: {
    width: string;
    height: string;
    weight: string;
  };
  shippingInformation?: string;
  returnPolicy?: "30 days return policy" | "no returns";
  meta?: Record<string, string>;
  thumbnail: string;
  images?: string[];
};

export type CartProduct = Pick<
  Product,
  "id" | "name" | "on_sale" | "sale_price" | "price" | "thumbnail" | "sku"
> & {
  quantity: number;
  isVariationProduct: boolean;
  size?: string;
  color?: string;
  custom_messsage?: string;
};

export type ProductVariation = {
  sku: string;
  size?: string;
  color?: string;
  price: number;
  sale_price?: number;
  stock: number;
};

export enum ProductAvailabilityStatus {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out Of Stock",
  PRE_ORDER = "Pre-order",
  LOW_STOCK = "Low Stock",
}

export type StockError = {
  sku: string;
  errorMessage: string;
  availableStock: number; 
  isDbError?: boolean;  // 👈 flag for supabase errors
}
