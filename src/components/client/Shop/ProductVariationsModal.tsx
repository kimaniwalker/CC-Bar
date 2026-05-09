import { montserrat } from "@/components/ds/Fonts";
import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import { Dispatch, SetStateAction } from "react";
import { ProductVariationTag } from "./ProductVariationTag";
import { AddToCartButton } from "./ProductAddToCart";
import { Product } from "@/types/Product";
type ProductVariationsModal = {
  product: Product
  setSelectedSize: Dispatch<SetStateAction<string>>;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  selectedSize: string;
  selectedColor: string;
};
export default function ProductVariationsModal({
  setSelectedColor,
  setSelectedSize,
  selectedSize,
  selectedColor,
  product
}: ProductVariationsModal) {


  const { available_colors, available_sizes } = product;

  const getModalHeading = () => {
    if (available_colors && available_sizes) {
      return "Select Size and Color";
    } else if (available_sizes) {
      return "Select Size";
    } else if (available_colors) {
      return "Select Color";
    } else {
      return "Product Details";
    }
  }
    
      return (
        <Stack direction="col" gap="md" className={`w-full ${montserrat.className}`}>
              <div className="w-full">
                <Text size="lg" className="font-semibold uppercase tracking-wide">{getModalHeading()}</Text>
              </div>
              <Stack direction="col" gap="md" justify="start" className="w-full">
                    <ProductVariationTag variation={available_sizes ?? []} heading="Available Sizes" selectedVariant={selectedSize} handleOnClick={(value) => setSelectedSize(value)} />
                    <ProductVariationTag variation={available_colors ?? []} heading="Available Colors" selectedVariant={selectedColor} handleOnClick={(value) => setSelectedColor(value)} />
              </Stack>        
          <AddToCartButton  product={product} selectedColor={selectedColor} selectedSize={selectedSize}/>
        </Stack>
      );
    
}
