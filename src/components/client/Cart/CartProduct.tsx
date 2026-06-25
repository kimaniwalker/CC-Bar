import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import { StockError, type CartProduct } from "@/types/Product";
import Image from "next/image";
import { useCart } from "./CartContext";
import {
  calculateProductPrice,
  formatSelectedOptions,
  getCartProductKey,
} from "@/utils/Cart/normalizeCartProduct";
import { montserrat } from "@/components/ds/Fonts";
import { useMediaQuery } from "react-responsive";
import { ProductHeartButton } from "../Favorites/ProductHeartButton";

export default function CartProduct({
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
  const cartButtonText = !isMobile
    ? `${product.quantity} ${product.quantity === 1 ? "item" : "items"} in cart`
    : `${product.quantity} in cart`;
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
    <Stack className="w-full lg:max-w-lg md:max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 my-4">
      <Stack className="w-full">
        <Stack gap="md" className="w-full">
          <div className="h-25 w-25 bg-gray-200 shrink-0 relative rounded-lg overflow-hidden flex justify-center align-center">
            <Image
              src={product.thumbnail}
              fill
              style={{ objectFit: "cover" }}
              alt="cart image"
              sizes="100px"
            />
            <ProductHeartButton
              product_id={product.id}
              className="-top-1 -right-1"
            />
          </div>
          <Stack direction="col" className="w-full">
            <Text
              size="md"
              className="mb-2 text-lg font-bold tracking-tight text-gray-900"
            >
              {product.name}
            </Text>

            {/* Display selected options */}
            {selectedOptionsText && (
              <Text size="sm" className="text-gray-600 mb-2">
                {selectedOptionsText}
              </Text>
            )}

            {error && (
              <Text size="sm" className="text-red-500 font-semibold mb-2">
                ⚠️ {error.errorMessage}
                {!isOutOfStock ? (
                  <button
                    onClick={updateProductQuantity}
                    className="ml-2 underline"
                  >
                    Adjust for me
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveProduct}
                    className="ml-2 underline"
                  >
                    Remove
                  </button>
                )}
              </Text>
            )}

            <div className="flex items-baseline gap-2 mb-2">
              <Text size="sm" className="font-bold text-gray-700">
                ${itemPrice.toFixed(2)}
              </Text>
              <Text size="xs" className="text-gray-500">
                × {product.quantity}
              </Text>
              <Text size="sm" className="font-bold text-gray-900 ml-auto">
                ${totalPrice.toFixed(2)}
              </Text>
            </div>

            <div
              className={`mt-2 flex items-center gap-3 ${montserrat.className} p-2 border-2 rounded-full justify-between w-full`}
            >
              <button
                onClick={() => removeFromCart(cartKey)}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={hasError}
              >
                −
              </button>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-center">
                {cartButtonText}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={hasError}
              >
                +
              </button>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
