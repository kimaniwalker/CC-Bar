import { Cart } from "@/types/Cart";
import { calculateProductPrice } from "@/utils/Cart/normalizeCartProduct";

export const handleCalculateCartTotal = (
  cart: Cart,
  shippingMethod: "delivery" | "pickup",
  isVip: boolean,
) => {
  // Calculate subtotal with product options
  const cartSubtotal = cart.reduce((total, item) => {
    const itemPrice = calculateProductPrice(item);
    return total + itemPrice * item.quantity;
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 75;
  const STANDARD_SHIPPING_COST = 9;

  // VIP members always get free shipping
  // Otherwise, charge shipping if cart < $75 and delivery is selected
  const shippingCost =
    isVip ||
    shippingMethod === "pickup" ||
    cartSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_COST;

  const vipDiscount = isVip ? cartSubtotal * 0.2 : 0; // 20% discount for VIPs

  return cartSubtotal + shippingCost - vipDiscount;
};
