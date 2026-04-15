import { Stack } from "@/components/ds/Stack";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useCart } from "../Cart/CartContext";
import { Product } from "@/types/Product";
import Modal from "../Modal";
import { useModal } from "../ModalContext";
import ProductVariationsModal from "./ProductVariationsModal";
import { generateSKU } from "@/utils/generateSku";

type QuickAddProps = {
  hideQuickAdd: boolean;
  product: Product;
};
export default function ProductCardQuickAdd({
  hideQuickAdd,
  product,
}: QuickAddProps) {
  const { addToCart, cart, removeProductById, removeFromCart } = useCart();
  const { isOpen, close, open } = useModal();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const hasQuantity = Boolean(cart.find((item) => item.id === product.id));
  const hasVariations = !!(
    product.available_colors?.length || product.available_sizes?.length
  );

  const handleATC = ({
    color,
    size,
  }: {
    color?: string;
    size?: string;
  } = {}) => {
    addToCart({
      ...product,
      quantity: 1,
      ...(color && { color }),
      ...(size && { size }),
      sku: generateSKU({
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
      }),
    });
  };
  const handleSelectSizeAndColor = () => {
    open();
  };
  console.log(product.sku)
  if (hideQuickAdd) return;
  return (
    <>
      <Stack
        justify="center"
        className={`w-full z-10 max-h-10 h-full absolute bottom-0`}
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
          <div className="flex w-full rounded-md shadow-xs z-10" role="group">
            <button
              disabled={!hasQuantity}
              type="button"
              onClick={() => removeFromCart(product.id, selectedColor, selectedSize)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white justify-center flex items-center disabled:bg-gray-200"
            >
              <svg
                className="w-[18px] h-[18px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={
                !hasVariations ? () => handleATC() : handleSelectSizeAndColor
              }
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white justify-center flex items-center"
            >
              <svg
                className="w-[18px] h-[18px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M5 3a1 1 0 0 0 0 2h.687L7.82 15.24A3 3 0 1 0 11.83 17h2.34A3 3 0 1 0 17 15H9.813l-.208-1h8.145a1 1 0 0 0 .979-.796l1.25-6A1 1 0 0 0 19 6h-2.268A2 2 0 0 1 15 9a2 2 0 1 1-4 0 2 2 0 0 1-1.732-3h-1.33L7.48 3.796A1 1 0 0 0 6.5 3H5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </Stack>
      <Modal isOpen={isOpen} onClose={close}>
        <ProductVariationsModal
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          available_sizes={product.available_sizes}
          available_colors={product.available_colors}
          setSelectedColor={setSelectedColor}
          setSelectedSize={setSelectedSize}
          onSubmit={() =>
            handleATC({ size: selectedSize, color: selectedColor })
          }
          onClose={close}
        />
      </Modal>
    </>
  );
}
