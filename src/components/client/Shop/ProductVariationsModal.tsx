import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import React, { Dispatch, SetStateAction } from "react";
type ProductVariationsModal = {
  available_sizes?: string[];
  available_colors?: string[];
  setSelectedSize: Dispatch<SetStateAction<string>>;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  selectedSize: string;
  selectedColor: string;
  onSubmit: () => void;
  onClose: () => void;
};
export default function ProductVariationsModal({
  available_sizes,
  available_colors,
  setSelectedColor,
  setSelectedSize,
  selectedSize,
  selectedColor,
  onSubmit,
  onClose,
}: ProductVariationsModal) {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };
  const isMissingColor = available_colors?.length && !selectedColor;
  const isMissingSize = available_sizes?.length && !selectedSize;
  const isDisabled = !!(isMissingColor || isMissingSize);
  return (
    <Stack direction="col" gap="md" align="center" className="w-full">
      {available_sizes && (
        <>
          <div className="w-full">
            <Text size="md" className="text-center">
              Select A Size
            </Text>
          </div>
          <Stack>
            {available_sizes?.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  type="button"
                  className={`border font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 w-16 h-16 flex justify-center items-center transition
        ${
          isSelected
            ? "bg-gray-900 text-white border-gray-900 dark:bg-gray-600 dark:text-white"
            : "text-gray-900 border-gray-800 hover:bg-gray-900 hover:text-white dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
        }`}
                >
                  {size}
                </button>
              );
            })}
          </Stack>
        </>
      )}
      {available_colors && (
        <>
          <div className="w-full">
            <Text size="md" className="text-center">
              Select A Color
            </Text>
          </div>
          <Stack gap="md" justify="center">
            {available_colors?.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  onClick={() => setSelectedColor(color)}
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  className={`border rounded-full w-16 h-16 flex justify-center items-center me-2 mb-2 transition
        ${
          isSelected
            ? "ring-4 ring-offset-2 ring-gray-900"
            : "border-gray-800 hover:ring-2 hover:ring-offset-2 hover:ring-gray-500"
        }`}
                ></button>
              );
            })}
          </Stack>
        </>
      )}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`text-gray-900 border border-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 focus:outline-none focus:ring-4
    ${
      isDisabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:text-white hover:bg-gray-900 focus:ring-gray-300 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
    }
    dark:border-gray-600 dark:text-gray-400`}
      >
        Add To Cart
      </button>
    </Stack>
  );
}
