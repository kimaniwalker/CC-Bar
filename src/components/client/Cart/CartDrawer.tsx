"use client";
import { Text } from "@/components/ds/Text";
import { useCart } from "./CartContext";
import CartProduct from "@/components/client/Cart/CartProduct";
import { CloseIcon } from "@/components/ds/CloseIcon";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { validateStock } from "@/utils/Product/validateProductStock";
import React from "react";
import { StockError } from "@/types/Product";
import { useUser } from "../Auth/AuthContext";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { CartBanner } from "./CartBanner";
import { Subscription } from "@/types/User";
import { CartBannerSkeleton } from "./CartBannerSkeleton";

const VIP_DISCOUNT = 0.2; // 20% off
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING_COST = 9;

export const CartDrawer = ({ onClose }: { onClose: () => void }) => {
  const { cart, getTotalCartQuantity, getCartSubtotal } = useCart();
  const { user } = useUser();
  const [errors, setErrors] = React.useState<StockError[]>([]);
  const [subscription, setSubscription] = React.useState<Subscription | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const cartQuanity = getTotalCartQuantity();
  const cartSubtotal = getCartSubtotal();

  React.useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const subscriptions = await getUserSubscription(user.id);
        const subscription = subscriptions?.[0];
        setSubscription(subscription ?? null);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.id]);

  const handleCheckout = async () => {
    // 👇 check stock first
    const { valid, errors } = await validateStock(cart);

    if (!valid) {
      setErrors(errors);
      return { success: false, errors }; // 👈 return errors to client
    }
    if (valid) {
      onClose();
      router.push("/checkout");
    }
  };

  const handleClearError = (sku: string) => {
    const filteredErrors = errors.filter((e) => e.sku !== sku);
    setErrors(filteredErrors);
  };

  const handleJoinVip = () => {
    router.push("/checkout?flow=isVipSubscription");
    onClose();
  };

  // Calculate VIP savings
  const vipDiscount = cartSubtotal * VIP_DISCOUNT;
  const shippingSavings =
    cartSubtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_COST : 0;
  const totalVipSavings = vipDiscount + shippingSavings;

  return (
    <AnimatePresence>
      <motion.div transition={{ type: "spring", duration: 1 }}>
        <div className="fixed top-0 right-0 w-full sm:w-lg h-full bg-white shadow-lg z-100 p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Text as="h2" size="lg" className="text-2xl font-bold">
              Your Cart ({cartQuanity})
            </Text>
            <CloseIcon onClose={onClose} />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartQuanity === 0 ? (
              <div className="flex flex-col flex-wrap mt-4">
                <Text size="lg">Your cart is empty</Text>
              </div>
            ) : (
              cart.map((product, index) => (
                <CartProduct
                  key={index}
                  product={product}
                  errors={errors}
                  onHandleUpdateProductQuantity={(sku) => handleClearError(sku)}
                />
              ))
            )}
          </div>

          {/* Cart Summary */}
          {cartQuanity > 0 && (
            <div className="border-t border-neutral-200 pt-4 mt-4 space-y-4">
              {/* VIP Banner */}
              {loading ? (
                <CartBannerSkeleton />
              ) : (
                <CartBanner
                  subscription={subscription}
                  totalVipSavings={totalVipSavings}
                  onClickJoinVip={handleJoinVip}
                />
              )}

              {/* Disclaimer */}
              <div className="space-y-2">
                <Text size="lg" className="font-bold">
                  Disclaimer
                </Text>
                <Text size="sm" className="text-neutral-600">
                  Free shipping on orders over $75 • Handmade to order • Ships
                  in 3–5 business days
                </Text>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                type="button"
                disabled={errors.length > 0}
                className="w-full rounded-2xl bg-black px-5 py-3 text-lg font-medium uppercase text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-700"
              >
                Continue to Checkout
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
