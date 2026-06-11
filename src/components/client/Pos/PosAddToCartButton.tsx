import { Text } from "@/components/ds/Text";
import { CartProduct, Product } from "@/types/Product";
import { getSelectedVariation } from "@/utils/Product/getSelectedVariation";
import { montserrat } from "@/components/ds/Fonts";
import { normalizeCartProduct } from "@/utils/Cart/normalizeCartProduct";
import { getProductSku } from "@/utils/Product/getProductSku";

export const PosAddToCartButton = ({
  product,
  selectedSize,
  selectedColor,
  onAddToCart,
}: {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
}) => {
  const selectedVariation = getSelectedVariation({
    product,
    selectedSize,
    selectedColor,
  });

  return (
    <>
      <button
        onClick={() =>
          onAddToCart(
            normalizeCartProduct(product, {
              size: selectedSize,
              color: selectedColor,
              sku: getProductSku({ product, selectedSize, selectedColor }),
            }),
          )
        }
        className={`mt-4 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-400 w-full ${montserrat.className}`}
      >
        <Text size="sm" as="span">
          Add to Cart -{" "}
          {selectedVariation
            ? `$${selectedVariation.sale_price ?? selectedVariation.price}`
            : `$${product.sale_price ?? product.price}`}
        </Text>
      </button>
    </>
  );
};
