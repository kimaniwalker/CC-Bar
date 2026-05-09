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
  const isMissingColor = available_colors?.length && !selectedColor;
  const isMissingSize = available_sizes?.length && !selectedSize;
  const isDisabled = !!(isMissingColor || isMissingSize);
    
      return (
        <Stack direction="col" gap="md" align="center" className={`w-full ${montserrat.className}`}>
          {available_sizes && (
            <>
              <div className="w-full">
                <Text size="md" className="font-semibold uppercase tracking-wide">Select A Size</Text>
              </div>
              <Stack direction="col" gap="md" justify="center">
               

                    <ProductVariationTag variation={available_sizes ?? []} heading="Available Sizes" selectedVariant={selectedSize} handleOnClick={(value) => setSelectedSize(value)} />
                    
                    <ProductVariationTag variation={available_colors ?? []} heading="Available Colors" selectedVariant={selectedColor} handleOnClick={(value) => setSelectedColor(value)} />
                
              </Stack>
            </>
          )}
    
          <AddToCartButton  product={product} selectedColor={selectedColor} selectedSize={selectedSize}/>
        </Stack>
      );
    
}
