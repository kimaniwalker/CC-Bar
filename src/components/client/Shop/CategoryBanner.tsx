import { montserrat } from "@/components/ds/Fonts";
import { Text } from "@/components/ds/Text";
import { getCategories } from "@/utils/Shop/getCategories";
import { Package, Sparkles } from "lucide-react";

export const CategoryBanner = async ({
  selectedCategory,
  product_count,
}: {
  selectedCategory: string;
  product_count: number;
}) => {
  const categories = await getCategories();
  const categoryData = categories.find(
    (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
  );
  const fallBackDescription = `Explore our collection of products crafted with care to elevate your everyday rituals. From soothing candles to invigorating essential oils, discover the perfect blend of luxury and wellness in every item.`;
  const description = categoryData?.description || fallBackDescription;

  return (
    <div className="relative w-full bg-linear-to-br from-neutral-50 via-white to-neutral-100 border-y border-neutral-200 mb-12 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-900/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <Text
              size="xs"
              className="text-white font-medium uppercase tracking-wide"
            >
              Curated Collection
            </Text>
          </div>

          {/* Title */}
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <Text
              size="xxl"
              as="div"
              className="text-4xl sm:text-5xl md:text-7xl font-black text-neutral-900 tracking-tight"
            >
              {selectedCategory}
            </Text>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-neutral-200 shadow-sm">
              <Package className="w-4 h-4 text-neutral-600" />
              <Text
                size="sm"
                className={`text-neutral-700 font-semibold ${montserrat.className}`}
              >
                {product_count} {product_count === 1 ? "product" : "products"}
              </Text>
            </div>
          </div>

          {/* Description */}
          <Text
            size="sm"
            className="text-neutral-600 leading-relaxed sm:text-lg"
          >
            {description}
          </Text>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-neutral-400 to-transparent" />
    </div>
  );
};

export const CategoryBannerSkeleton = () => {
  return (
    <div className="relative w-full bg-linear-to-br from-neutral-50 via-white to-neutral-100 border-y border-neutral-200 mb-12 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-pulse">
        <div className="max-w-4xl">
          {/* Badge skeleton */}
          <div className="h-7 w-36 bg-neutral-300 rounded-full mb-4" />

          {/* Title skeleton */}
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <div className="h-12 sm:h-14 w-64 bg-neutral-300 rounded-lg" />
            <div className="h-10 w-32 bg-neutral-200 rounded-full" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full max-w-2xl bg-neutral-200 rounded" />
            <div className="h-5 w-3/4 max-w-xl bg-neutral-200 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-neutral-300 to-transparent" />
    </div>
  );
};
