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
import { Crown, Sparkles } from "lucide-react";
import { useUser } from "../Auth/AuthContext";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { handleCalculateCartTotal } from "@/utils/Checkout/handleCalculateCartTotal";

const VIP_DISCOUNT = 0.2; // 20% off
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING_COST = 9;

export const CartDrawer = ({ onClose }: { onClose: () => void }) => {
  const { cart, getTotalCartQuantity, getCartSubtotal } = useCart();
  const { user } = useUser();
  const [errors, setErrors] = React.useState<StockError[]>([]);
  const [hasActiveSubscription, setHasActiveSubscription] =
    React.useState(false);
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
        const isActive =
          subscriptions?.[0]?.status === SubscriptionStatus.ACTIVE;
        setHasActiveSubscription(isActive);
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
              {/* VIP Savings Banner */}
              {!loading && !hasActiveSubscription && (
                <button
                  className="w-full"
                  onClick={() => {
                    router.push("/checkout?flow=isVipSubscription");
                    onClose();
                  }}
                >
                  <div className="rounded-xl border border-purple-200 bg-linear-to-r from-purple-50 to-pink-50 p-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-600" />

                      <Text size="sm" className="font-semibold text-purple-900">
                        Unlock VIP Savings
                      </Text>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-4">
                      <div>
                        <Text size="xs" className="text-purple-700">
                          Join today and save{" "}
                          <span className="font-semibold">
                            ${totalVipSavings.toFixed(2)}
                          </span>{" "}
                          on this order.
                        </Text>
                      </div>

                      <Sparkles className="h-4 w-4 shrink-0 text-purple-600" />
                    </div>
                  </div>
                </button>
              )}

              {/* Active VIP Banner */}
              {!loading && hasActiveSubscription && (
                <div className="rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-emerald-600" />
                    <div className="flex-1">
                      <Text
                        size="sm"
                        className="font-semibold text-emerald-900"
                      >
                        VIP Savings Applied
                      </Text>
                      <Text size="xs" className="text-emerald-700">
                        You&apos;re saving ${totalVipSavings.toFixed(2)} ✨
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Subtotal */}
              <div className="flex justify-between items-center">
                <Text size="md" className="font-medium">
                  Subtotal
                </Text>
                <Text size="md" className="font-semibold">
                  $
                  {handleCalculateCartTotal(
                    cart,
                    "delivery",
                    hasActiveSubscription,
                  ).toFixed(2)}
                </Text>
              </div>

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
