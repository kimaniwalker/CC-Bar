export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category?: string[];
  price: number;
  on_sale: boolean;
  sale_price?: number;
  stock?: number;
  available_sizes?: string[];
  available_colors?: string[];
  variations?: ProductVariation[];
  availabilityStatus?: "Low Stock" | "Out Of Stock" | "Available";
  tags?: string[];
  brand?: string;
  dimensions?: {
    width: number;
    height: number;
    weight: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  reviews?: [
    {
      rating: number;
      comment: string;
      date: string;
      reviewerName: string;
      reviewerEmail?: string;
    }
  ];
  returnPolicy?: "30 days return policy" | "no returns";
  minimumOrderQuantity?: number;
  meta?: Record<string, string>;
  thumbnail: string;
  images?: string[];
};

export type CartProduct = Pick<
  Product,
  "id" | "name" | "on_sale" | "sale_price" | "price" | "thumbnail" | "sku"
> & {
  quantity: number;
  size?: string;
  color?: string;
  custom_messsage?: string;
};

type ProductVariation = {
  sku: string;
  size?: string;
  color?: string;
  price: number;
  sale_price?: number;
  stock?: number;
};
