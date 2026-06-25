"use client";

import { Product, ProductOptionGroups, ProductOptions } from "@/types/Product";
import { normalizeCartProduct } from "@/utils/Cart/normalizeCartProduct";
import { useCart } from "../Cart/CartContext";
import ProductVariationsModal from "../Shop/ProductVariationsModal";
import { useModal } from "../ModalContext";
import { Text } from "@/components/ds/Text";

type ProductWithOptions = Product & {
  product_option_groups?: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
};

export const AddToCartPillButton = ({
  product,
}: {
  product: ProductWithOptions;
}) => {
  const { addToCart } = useCart();
  const { open } = useModal();

  const hasOptions = !!product.product_option_groups?.some((group) =>
    group.product_options.some((opt) => opt.active),
  );
  const isOutOfStock = product.stock === 0;

  const handleOnAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(
      normalizeCartProduct(product, {
        quantity: 1,
        selected_options: {},
      }),
    );
  };

  const handleOpenOptionsModal = () => {
    open(<ProductVariationsModal key={product.id} product={product} />, {
      maxWidth: "lg",
      padding: "lg",
    });
  };

  return (
    <button
      onClick={hasOptions ? handleOpenOptionsModal : handleOnAddToCart}
      disabled={isOutOfStock}
      className="mt-2 rounded-full border border-neutral-300 px-4 py-2 text-xs font-medium transition hover:bg-neutral-100 disabled:bg-gray-200 disabled:cursor-not-allowed min-w-max"
    >
      <Text size="xs" as="span" className="text-xs">
        {isOutOfStock ? "Out of Stock" : "Add to cart"}
      </Text>
    </button>
  );
};
