"use client";

import { Text } from "@/components/ds/Text";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterCategory = {
  name: string;
  key: string;
  options: FilterOption[];
};

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    name: "Sort By",
    key: "sort",
    options: [
      { label: "Price: Low to High", value: "price_asc" },
      { label: "Price: High to Low", value: "price_desc" },
      { label: "Newest First", value: "newest" },
      { label: "Best Selling", value: "bestselling" },
      { label: "A-Z", value: "name_asc" },
      { label: "Z-A", value: "name_desc" },
    ],
  },
  {
    name: "Price Range",
    key: "price",
    options: [
      { label: "Under $25", value: "0-25" },
      { label: "$25 - $50", value: "25-50" },
      { label: "$50 - $100", value: "50-100" },
      { label: "$100+", value: "100-999999" },
    ],
  },
  {
    name: "Scent Family",
    key: "scent",
    options: [
      { label: "Floral", value: "floral" },
      { label: "Fresh", value: "fresh" },
      { label: "Woody", value: "woody" },
      { label: "Citrus", value: "citrus" },
      { label: "Spicy", value: "spicy" },
      { label: "Sweet", value: "sweet" },
    ],
  },
  {
    name: "Size",
    key: "size",
    options: [
      { label: "Small (4oz)", value: "small" },
      { label: "Medium (8oz)", value: "medium" },
      { label: "Large (12oz)", value: "large" },
    ],
  },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "sort",
  ]);

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Keep query and category, remove all filters
    const query = params.get("query");
    const category = params.get("category");
    const newParams = new URLSearchParams();
    if (query) newParams.set("query", query);
    if (category) newParams.set("category", category);
    router.push(`?${newParams.toString()}`);
  };

  const activeFilters = FILTER_CATEGORIES.reduce(
    (acc, category) => {
      const value = searchParams.get(category.key);
      if (value) {
        const option = category.options.find((opt) => opt.value === value);
        if (option) {
          acc.push({ key: category.key, label: option.label });
        }
      }
      return acc;
    },
    [] as { key: string; label: string }[],
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-neutral-200 px-4 py-3 -mx-4 mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <FilterContent
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            handleFilterChange={handleFilterChange}
            clearFilter={clearFilter}
            clearAllFilters={clearAllFilters}
            activeFilters={activeFilters}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-99 overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-4 flex items-center justify-between">
                <Text size="lg" className="font-bold text-neutral-900">
                  Filters
                </Text>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <FilterContent
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  handleFilterChange={handleFilterChange}
                  clearFilter={clearFilter}
                  clearAllFilters={clearAllFilters}
                  activeFilters={activeFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterContent({
  expandedCategories,
  toggleCategory,
  handleFilterChange,
  clearFilter,
  clearAllFilters,
  activeFilters,
}: {
  expandedCategories: string[];
  toggleCategory: (key: string) => void;
  handleFilterChange: (key: string, value: string) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  activeFilters: { key: string; label: string }[];
}) {
  const searchParams = useSearchParams();

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="pb-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <Text size="lg" className="font-semibold text-neutral-900 text-lg">
              Active Filters
            </Text>
            <button
              onClick={clearAllFilters}
              className="text-xs text-neutral-600 hover:text-neutral-900 underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => clearFilter(filter.key)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-medium text-neutral-700 transition"
              >
                {filter.label}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Categories */}
      {FILTER_CATEGORIES.map((category) => {
        const isExpanded = expandedCategories.includes(category.key);
        const selectedValue = searchParams.get(category.key);

        return (
          <div key={category.key} className="border-b border-neutral-200 pb-6">
            <button
              onClick={() => toggleCategory(category.key)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <Text
                size="lg"
                className="font-semibold text-neutral-900 text-lg"
              >
                {category.name}
              </Text>
              <ChevronDown
                className={`w-5 h-5 text-neutral-600 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  {category.options.map((option) => {
                    const isSelected = selectedValue === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          isSelected
                            ? clearFilter(category.key)
                            : handleFilterChange(category.key, option.value)
                        }
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          isSelected
                            ? "bg-neutral-900 text-white"
                            : "hover:bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        <Text size="sm" className="font-medium">
                          {option.label}
                        </Text>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
