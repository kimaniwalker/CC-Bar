import { Text } from "@/components/ds/Text";
import { ProductOptionGroups, ProductOptions } from "@/types/Product";
import { capitalize } from "lodash";
import { Check } from "lucide-react";

type ProductOptionSelectorProps = {
  group: ProductOptionGroups & {
    product_options: ProductOptions[];
  };
  selectedOptionId?: string | string[];
  onSelect: (groupId: string, optionId: string | string[]) => void;
};

export const ProductOptionSelector = ({
  group,
  selectedOptionId,
  onSelect,
}: ProductOptionSelectorProps) => {
  const activeOptions = group.product_options
    .filter((opt) => opt.active)
    .sort((a, b) => a.display_order - b.display_order);

  if (activeOptions.length === 0) return null;

  const isMultiple = group.selection_type === "multiple";
  const selectedIds = Array.isArray(selectedOptionId)
    ? selectedOptionId
    : selectedOptionId
      ? [selectedOptionId]
      : [];

  const maxSelections = group.max_selections || null;

  const handleSelect = (optionId: string) => {
    if (isMultiple) {
      const isCurrentlySelected = selectedIds.includes(optionId);

      // If trying to select and already at max
      if (
        !isCurrentlySelected &&
        maxSelections &&
        selectedIds.length >= maxSelections
      ) {
        return; // Don't allow selection
      }

      // Toggle selection for multiple
      const newSelection = isCurrentlySelected
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId];
      onSelect(group.id, newSelection);
    } else {
      // Single selection
      onSelect(group.id, optionId);
    }
  };

  const isSelected = (optionId: string) => selectedIds.includes(optionId);
  const isDisabled = (optionId: string) => {
    if (!isMultiple || !maxSelections) return false;
    return !isSelected(optionId) && selectedIds.length >= maxSelections;
  };

  return (
    <div>
      <Text size="lg" className="font-semibold mb-2 text-md">
        {capitalize(group.name)}
        {isMultiple && (
          <span className="ml-2 text-xs text-gray-500 font-normal">
            {maxSelections
              ? `(Choose up to ${maxSelections})`
              : "(Select all that apply)"}
          </span>
        )}
      </Text>

      {/* Progress indicator for max selections */}
      {isMultiple && maxSelections && (
        <div className="mb-2 text-xs text-gray-600">
          {selectedIds.length} of {maxSelections} selected
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {activeOptions.map((option) => {
          const selected = isSelected(option.id);
          const disabled = isDisabled(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={disabled}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold uppercase transition ${
                selected
                  ? "bg-black border-black border-2 text-white"
                  : disabled
                    ? "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-transparent cursor-pointer"
              }`}
            >
              {isMultiple && selected && <Check className="w-3.5 h-3.5" />}
              <Text as="span" size="md" className="font-semibold text-sm">
                {option.name}
                {option.price_adjustment > 0 &&
                  ` (+$${(option.price_adjustment / 100).toFixed(2)})`}
              </Text>
            </button>
          );
        })}
      </div>
    </div>
  );
};
