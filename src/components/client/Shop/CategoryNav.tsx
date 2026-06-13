"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/ds/Text";

export const CategoryNav = ({
  categories,
  selectedCategory,
}: {
  categories: string[];
  selectedCategory: string;
}) => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/shop?category=${category}`);
  };

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide -mb-px">
            <ul className="flex gap-8 min-w-min px-4 sm:px-6 lg:px-8">
              {/* All Products */}
              <li>
                <button
                  onClick={() => router.push("/shop")}
                  className={`relative py-4 whitespace-nowrap transition-colors group ${
                    !selectedCategory
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Text size="sm" className="font-semibold">
                    All Products
                  </Text>
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 transition-opacity ${
                      !selectedCategory ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {/* Hover underline */}
                  {selectedCategory && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </li>

              {categories.map((category) => {
                const isSelected = category === selectedCategory;

                return (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`relative py-4 whitespace-nowrap transition-colors group ${
                        isSelected
                          ? "text-neutral-900"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      <Text size="sm" className="font-semibold">
                        {category}
                      </Text>
                      {/* Active underline */}
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {/* Hover underline */}
                      {!isSelected && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Gradient fade right - positioned outside scroll container */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </nav>
  );
};
