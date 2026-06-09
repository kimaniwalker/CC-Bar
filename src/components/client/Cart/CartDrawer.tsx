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

export const CartDrawer = ({ onClose }: { onClose: () => void }) => {
  const { cart, getTotalCartQuantity, getCartSubtotal } = useCart();
  const [errors, setErrors] = React.useState<StockError[]>([]);
  const router = useRouter();

  const cartQuanity = getTotalCartQuantity();
  const cartSubtotal = getCartSubtotal();

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
              {/* Current Subtotal */}
              <div className="flex justify-between items-center">
                <Text size="md" className="font-medium">
                  Subtotal
                </Text>
                <Text size="md" className="font-semibold">
                  ${cartSubtotal.toFixed(2)}
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
