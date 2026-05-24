import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import { StockError, type CartProduct } from "@/types/Product";
import Image from "next/image";
import { useCart } from "./CartContext";
import { normalizeCartProduct } from "@/utils/Cart/normalizeCartProduct";
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
  onHandleUpdateProductQuantity?: (sku: string) => void;
}) {
  const hasVariation = product.color || product.size;
  const productName = hasVariation
    ? `${product.name} - ${[product.color, product.size].filter(Boolean).join(" - ")}`
    : product.name;
  const {
    addToCart,
    removeFromCart,
    handleAdjustProductQuantity,
    removeProductBySku,
  } = useCart();
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const error = errors?.find((e) => e.sku === product.sku);
  const isDbError = error?.isDbError ?? false;
  const isOutOfStock = error?.availableStock === 0 && !isDbError; // only consider out of stock if it's not a DB error (which we can't verify stock for)
  const cartButtonText = !isMobile
    ? `${product.quantity} ${product.quantity === 1 ? "item" : "items"} in cart`
    : `${product.quantity} in cart`;
  const hasError = Boolean(error);
  const updateProductQuantity = () => {
    if (!error) return; // no error, no adjustment needed
    if (error) handleAdjustProductQuantity(product.sku, error.availableStock);
    // 👈 cap to available
    onHandleUpdateProductQuantity?.(product.sku); // trigger any additional updates needed after adjusting quantity
  };
  const handleRemoveProduct = () => {
    removeProductBySku(product.sku);
    onHandleUpdateProductQuantity?.(product.sku); // trigger any additional updates needed after removal
  };
  return (
    <Stack
      className="w-full
lg:max-w-lg
md:max-w-md
p-6 bg-white border border-gray-200 rounded-lg shadow-sm
hover:bg-gray-100 my-4"
    >
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
              className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {productName}
            </Text>
            {error && (
              <Text size="sm" className="text-red-500 font-semibold mb-2">
                ⚠️ {error.errorMessage}
                {!isOutOfStock && ( // 👈 only show adjust if not fully OOS
                  <button
                    onClick={updateProductQuantity}
                    className="ml-2 underline"
                  >
                    Adjust for me
                  </button>
                )}
                {isOutOfStock && ( // 👈 prompt removal if OOS
                  <button
                    onClick={handleRemoveProduct}
                    className="ml-2 underline"
                  >
                    Remove
                  </button>
                )}
              </Text>
            )}
            <Text
              size="sm"
              className="font-bold text-gray-700 dark:text-gray-400 mb-2"
            >
              ${product.price} x {product.quantity}
            </Text>

            <div
              className={`mt-2 flex items-center gap-3 ${montserrat.className} p-2 border-2 rounded-full justify-between w-full`}
            >
              <button
                onClick={() => removeFromCart(product.sku)}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={hasError}
              >
                −
              </button>
              <span className="text-xs sm:text-sm md:text-lg font-semibold text-center">
                {cartButtonText}
              </span>
              <button
                onClick={() => addToCart(normalizeCartProduct(product))}
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
