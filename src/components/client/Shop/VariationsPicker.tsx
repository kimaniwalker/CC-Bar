"use client";

import { montserrat } from "@/components/ds/Fonts";
import { Product, ProductVariation } from "@/types/Product";
import { useState } from "react";
import { useCart } from "../Cart/CartContext";

export const VariationsPicker = ({
  available_sizes,
  available_colors,
  availabilityStatus,
  variations
}: {
  available_sizes?: string[];
  available_colors?: string[];
  availabilityStatus: Pick<Product, "availabilityStatus">["availabilityStatus"];
  variations?: ProductVariation[];
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const {addToCart} = useCart();
  const handleATC = () => {  if (!canAddToCart) return;
  }

  const canAddToCart =
    availabilityStatus !== "Out Of Stock" &&
    (!available_sizes || selectedSize) &&
    (!available_colors || selectedColor);

    const getSelectedVariation = () => {
        if (!variations) return null;
        return variations.find(v => v.size === selectedSize && v.color === selectedColor);
    }

    const selectedVariation = getSelectedVariation();

  return (
    <div className="flex flex-col gap-4">
      {/* Sizes */}
      {available_sizes && (
        <div>
          <p className="font-semibold mb-2">Available Sizes</p>
          <div className="flex gap-2">
            {available_sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 uppercase ${
                  selectedSize === size ? "bg-black border-black border-2" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {available_colors && (
        <div>
          <p className="font-semibold mb-2">Available Colors</p>
          <div className="flex gap-2">
            {available_colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`bg-gray-200 inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 uppercase ${
                    selectedColor === color ? "border-black border-2" : ""
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <button
        disabled={!canAddToCart}
        className={`mt-4 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-400 ${montserrat.className}`}
        onClick={() => {
          console.log({
            size: selectedSize,
            color: selectedColor,
          });
        }}
      >
        ADD TO CART {selectedVariation && `- $${selectedVariation.sale_price ?? selectedVariation.price}`}
      </button>
    </div>
  );
};