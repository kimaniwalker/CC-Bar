import { Product } from "./Product";

export enum ORDER_STATUS {
  PENDING_PAYMENT = "Pending Payment",
  CONFIRMED = "Confirmed",
  PREPARING = "Preparing Shipment",
  POURING = "Pouring",
  CURING = "Curing",
  PACKAGING = "Packing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  PARTIALLY_PAID = "Partially Paid",
  PAID = "Paid",
}

export interface Order {
  id: string;
  user_id?: string;
  stripe_payment_intent_id: string;
  stripe_customer_id?: string;
  status: ORDER_STATUS;
  subtotal?: number;
  shipping_total?: number;
  total: number;
  shipping_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  order_source?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  sku: string;
  selected_options?: Record<string, string>;
  custom_message?: string;
}

export type OrdersResponse = Order & { order_items: OrderItem[] };

export type OrderDetailsResponse = OrderItem & {
  product: Pick<Product, "id" | "name" | "description" | "thumbnail">;
};

export type OrderWithProducts = OrdersResponse & { products: Product[] };

export type OrderInsert = Omit<Order, "id" | "created_at">;
