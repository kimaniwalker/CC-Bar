import { Stack } from "@/components/ds/Stack";
import { motion } from "motion/react";
import { useCart } from "../Cart/CartContext";
import { ProductWithOptions } from "@/types/Product";
import { useModal } from "../ModalContext";
import ProductVariationsModal from "./ProductVariationsModal";
import { Trash2, ShoppingCart } from "lucide-react";
import { getCartProductKey } from "@/utils/Cart/normalizeCartProduct";
import { sendGTMEvent } from "@next/third-parties/google";

type QuickAddProps = {
  hideQuickAdd: boolean;
  product: ProductWithOptions;
};

export default function ProductCardQuickAdd({
  hideQuickAdd,
  product,
}: QuickAddProps) {
  const { addToCart, cart, removeProductByKey } = useCart();
  const { open } = useModal();

  // Check if ANY version of this product (with any options) is in cart
  const hasQuantity = cart.some((item) => item.id === product.id);

  const hasOptions = !!product.product_option_groups?.some((group) =>
    group.product_options.some((opt) => opt.active),
  );
  const isOutOfStock = product.stock === 0;

  const handleQuickAdd = () => {
    if (isOutOfStock) return;

    // Quick add without options - just add to cart with defaults
    addToCart({
      ...product,
      quantity: 1,
      selected_options: undefined,
    });
    sendGTMEvent({
      event: "addToCart",
      product_id: product.id,
      sku: product.sku,
      name: product.name,
      type: product.type,
      product_price: product.price,
      product_category: "fishy test",
      search_term: "testing this",
      onSale: product.on_sale,
    });
  };

  const handleOpenOptionsModal = () => {
    open(<ProductVariationsModal key={product.id} product={product} />, {
      maxWidth: "lg",
      padding: "lg",
      showCloseButton: true,
    });
  };

  const handleRemove = () => {
    // Find all cart items with this product ID
    const itemsToRemove = cart.filter((item) => item.id === product.id);

    // Remove all versions of this product
    itemsToRemove.forEach((item) => {
      const key = getCartProductKey(item);
      removeProductByKey(key);
    });
  };

  if (hideQuickAdd) return null;

  return (
    <Stack
      justify="center"
      className="w-full z-10 max-h-10 h-full absolute bottom-0"
    >
      <motion.div
        className="w-3/4"
        initial={{ y: 25 }}
        animate={{ y: 0 }}
        exit={{ opacity: 0, y: 25 }}
        transition={{
          ease: "easeInOut",
          duration: 0.5,
        }}
      >
        <div className="flex w-full rounded-md shadow-sm z-10" role="group">
          {/* Remove Button */}
          <button
            disabled={!hasQuantity || isOutOfStock}
            type="button"
            onClick={handleRemove}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-red-600 focus:z-10 focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 justify-center flex items-center disabled:bg-gray-200 disabled:cursor-not-allowed transition"
            aria-label="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Add to Cart / Select Options Button */}
          <button
            type="button"
            onClick={hasOptions ? handleOpenOptionsModal : handleQuickAdd}
            disabled={!hasOptions && isOutOfStock}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-600 focus:z-10 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 justify-center flex items-center gap-1.5 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
            aria-label={hasOptions ? "Select options" : "Add to cart"}
          >
            <ShoppingCart className="w-4 h-4" />
            {hasOptions && <span className="text-xs">+</span>}
          </button>
        </div>
      </motion.div>
    </Stack>
  );
}
