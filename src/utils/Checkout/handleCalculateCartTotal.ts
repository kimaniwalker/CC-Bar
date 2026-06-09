import { Cart } from "@/types/Cart";

export const handleCalculateCartTotal = (
  cart: Cart,
  shippingMethod: "delivery" | "pickup",
  isVip: boolean,
) => {
  const cartSubtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 75;
  const STANDARD_SHIPPING_COST = 9;

  const SHIPPING_COST =
    cartSubtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_COST : 0;
  const shippingCost = shippingMethod === "delivery" ? SHIPPING_COST : 0;

  const vipDiscount = isVip ? cartSubtotal * 0.2 : 0; // 20% discount for VIPs

  return cartSubtotal + shippingCost - vipDiscount;
};
