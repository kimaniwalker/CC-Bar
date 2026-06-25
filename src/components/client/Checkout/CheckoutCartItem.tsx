import { Text } from "@/components/ds/Text";
import { StockError, type CartProduct } from "@/types/Product";
import Image from "next/image";
import {
  calculateProductPrice,
  formatSelectedOptions,
  getCartProductKey,
} from "@/utils/Cart/normalizeCartProduct";
import { montserrat } from "@/components/ds/Fonts";
import { useMediaQuery } from "react-responsive";
import { ProductHeartButton } from "../Favorites/ProductHeartButton";
import { useCart } from "../Cart/CartContext";
import { Minus, Plus, AlertCircle, Trash2 } from "lucide-react";
import { motion } from "motion/react";

export default function CheckoutCartItem({
  product,
  errors,
  onHandleUpdateProductQuantity,
}: {
  product: CartProduct;
  errors?: StockError[];
  onHandleUpdateProductQuantity?: (key: string) => void;
}) {
  const {
    addToCart,
    removeFromCart,
    handleAdjustProductQuantity,
    removeProductByKey,
  } = useCart();
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  // Get unique cart key for this product + options
  const cartKey = getCartProductKey(product);

  const error = errors?.find((e) => e.key === cartKey);
  const isDbError = error?.isDbError ?? false;
  const isOutOfStock = error?.availableStock === 0 && !isDbError;
  const hasError = Boolean(error);

  // Format selected options for display
  const selectedOptionsText = formatSelectedOptions(product);

  // Calculate final price with options
  const itemPrice = calculateProductPrice(product);
  const totalPrice = itemPrice * product.quantity;

  const updateProductQuantity = () => {
    if (!error) return;
    handleAdjustProductQuantity(cartKey, error.availableStock);
    onHandleUpdateProductQuantity?.(cartKey);
  };

  const handleRemoveProduct = () => {
    removeProductByKey(cartKey);
    onHandleUpdateProductQuantity?.(cartKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl border-2 transition-all ${
        hasError
          ? "border-red-200 bg-red-50/50"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      } p-4 shadow-sm hover:shadow-md`}
    >
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mb-4 rounded-xl bg-red-100 border border-red-200 p-3"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <Text size="sm" className="text-red-900 font-medium">
                {error.errorMessage}
              </Text>
              <div className="mt-2 flex gap-2">
                {!isOutOfStock && (
                  <button
                    onClick={updateProductQuantity}
                    className="text-xs font-semibold text-red-700 hover:text-red-900 underline"
                  >
                    Adjust for me
                  </button>
                )}
                {isOutOfStock && (
                  <button
                    onClick={handleRemoveProduct}
                    className="text-xs font-semibold text-red-700 hover:text-red-900 underline"
                  >
                    Remove item
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          <Image
            src={product.thumbnail}
            fill
            style={{ objectFit: "cover" }}
            alt={product.name}
            sizes="(max-width: 640px) 96px, 112px"
            className="transition-transform hover:scale-105"
          />
          <ProductHeartButton
            product_id={product.id}
            className="absolute top-1 right-1"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Text size="md" className="font-bold text-neutral-900 line-clamp-2">
              {product.name}
            </Text>
            <button
              onClick={handleRemoveProduct}
              className="shrink-0 p-1.5 rounded-full hover:bg-neutral-100 transition text-neutral-400 hover:text-red-600"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Options */}
          {selectedOptionsText && (
            <Text size="sm" className="text-neutral-600 mb-2">
              {selectedOptionsText}
            </Text>
          )}

          {/* Price */}
          <Text size="sm" className="font-semibold text-neutral-900 mb-3">
            ${itemPrice.toFixed(2)}{" "}
            <span className="text-neutral-500">× {product.quantity}</span>
            <span className="ml-2 text-neutral-700">
              = ${totalPrice.toFixed(2)}
            </span>
          </Text>

          {/* Quantity Controls */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 bg-white p-1">
            <button
              onClick={() => removeFromCart(cartKey)}
              disabled={hasError}
              className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition disabled:bg-neutral-300 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span
              className={`px-3 text-sm font-bold text-neutral-900 min-w-15 text-center ${montserrat.className}`}
            >
              {isMobile
                ? product.quantity
                : `${product.quantity} ${product.quantity === 1 ? "item" : "items"}`}
            </span>

            <button
              onClick={() => addToCart(product)}
              disabled={hasError}
              className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition disabled:bg-neutral-300 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
