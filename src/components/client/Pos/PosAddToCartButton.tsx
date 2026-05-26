import { Text } from "@/components/ds/Text";
import {
  CartProduct,
  Product,
  ProductAvailabilityStatus,
} from "@/types/Product";
import { getSelectedVariation } from "@/utils/Product/getSelectedVariation";
import { ProductStockStatus } from "../Shop/ProductStockStatus";
import { montserrat } from "@/components/ds/Fonts";
import { normalizeCartProduct } from "@/utils/Cart/normalizeCartProduct";
import { getProductSku } from "@/utils/Product/getProductSku";

export const PosAddToCartButton = ({
  product,
  selectedSize,
  selectedColor,
  cart,
  onAddToCart,
  onDecreaseQuantity,
}: {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
  onDecreaseQuantity: (sku: string) => void;
}) => {
  const { variations, available_colors, available_sizes, stock } = product;

  const getStockStatus = (stock: number): ProductAvailabilityStatus => {
    if (stock === null || stock === undefined)
      return ProductAvailabilityStatus.OUT_OF_STOCK; // treat as in stock if no stock info
    if (stock <= 0) return ProductAvailabilityStatus.OUT_OF_STOCK;
    if (stock <= 10) return ProductAvailabilityStatus.LOW_STOCK;
    return ProductAvailabilityStatus.IN_STOCK;
  };

  const selectedVariation = getSelectedVariation({
    product,
    selectedSize,
    selectedColor,
  });

  const getSelectedVariationQuantity = ({
    product,
    selectedColor,
    selectedSize,
  }: {
    product: Product;
    selectedColor: string;
    selectedSize: string;
  }) => {
    const variation = product.variations?.find((v) => {
      const sizeMatch = v.size ? v.size === selectedSize : true;
      const colorMatch = v.color ? v.color === selectedColor : true;
      return sizeMatch && colorMatch;
    });

    if (!variation?.sku) return 0;

    return cart
      .filter((item) => item.sku === variation.sku)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const selectedVariationQuantityInCart = getSelectedVariationQuantity({
    product,
    selectedColor: selectedColor ?? "",
    selectedSize: selectedSize ?? "",
  });
  const isVariationProduct = variations && variations.length > 0;

  const hasRequiredSelections =
    (!available_sizes || selectedSize) && (!available_colors || selectedColor);

  const getCartProductQuantity = (id: string) =>
    cart
      .filter((item: CartProduct) => item.id === id)
      .reduce((total, item) => total + (item.quantity || 1), 0);

  const cartProductQuantity = getCartProductQuantity(product.id) ?? 0;
  const hasCartQuantity = cartProductQuantity > 0;

  const activeStock = isVariationProduct
    ? (selectedVariation?.stock ?? 0)
    : (stock ?? 0);

  const product_availability_status = hasRequiredSelections
    ? getStockStatus(activeStock)
    : ProductAvailabilityStatus.IN_STOCK; // default until selections made

  const canAddMoreToCart = isVariationProduct
    ? selectedVariationQuantityInCart < activeStock
    : cartProductQuantity < stock;

  const canAddToCart =
    hasRequiredSelections &&
    product_availability_status !== ProductAvailabilityStatus.OUT_OF_STOCK &&
    canAddMoreToCart;

  if (
    hasRequiredSelections &&
    product_availability_status === ProductAvailabilityStatus.OUT_OF_STOCK
  ) {
    return (
      <button
        disabled
        className={`mt-4 bg-gray-400 text-white px-4 py-2 rounded-xl cursor-not-allowed ${montserrat.className}`}
      >
        <Text size="sm" as="span">
          Out of Stock
        </Text>
      </button>
    );
  }

  if (cartProductQuantity) {
    return (
      <>
        <ProductStockStatus
          stock={activeStock}
          hideStatus={hasRequiredSelections ? false : true}
        />
        <div
          className={`mt-2 flex items-center gap-3 ${montserrat.className} p-2 border-2 rounded-full justify-between w-full`}
        >
          <button
            onClick={() =>
              onDecreaseQuantity(
                getProductSku({ product, selectedSize, selectedColor }),
              )
            }
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!hasCartQuantity || isVariationProduct}
          >
            −
          </button>
          <span className="text-lg font-semibold text-center">
            {cartProductQuantity} {cartProductQuantity === 1 ? "item" : "items"}{" "}
            in cart
          </span>
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
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!canAddToCart}
          >
            +
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductStockStatus
        stock={activeStock}
        hideStatus={hasRequiredSelections ? false : true}
      />
      <button
        disabled={!canAddToCart}
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
