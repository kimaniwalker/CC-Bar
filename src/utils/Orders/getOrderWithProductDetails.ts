import { OrderWithProducts } from "@/types/Orders";
import { getOrderDetails } from "./getOrderDetails";
import { getProductDetails } from "../Shop/getProductDetails";

export async function getOrderWithProductDetails(id: string): Promise<OrderWithProducts | null> {
  const orderDetails = await getOrderDetails(id);

  if (!orderDetails || orderDetails.length === 0) return null;

  const productList = orderDetails[0]?.order_items.map(item => item.product_id) || [];
  const productDetails = await getProductDetails(productList);

  return {
    ...orderDetails[0],
    products: productDetails ?? [],
  };
}