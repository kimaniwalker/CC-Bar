import { montserrat } from "@/components/ds/Fonts";
import { Text } from "@/components/ds/Text";
import { getCategories } from "@/utils/server/getCategories";

export const CategoryBanner = async({ selectedCategory, product_count }: { selectedCategory: string, product_count: number }) => {
    const categories = await getCategories();
    const categoryData = categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
    const fallBackDescription = `Explore our collection of products crafted with care to elevate your everyday rituals. From soothing candles to invigorating essential oils, discover the perfect blend of luxury and wellness in every item.`;
    const description = categoryData?.description || fallBackDescription;
    
    return (
        <div className="w-full min-h-64 bg-gray-100 flex flex-col items-center justify-center mb-8 p-4">
            <div className="w-full max-w-4xl">
            <div className="flex items-baseline">

            <Text size="xl" className="text-4xl font-bold text-black uppercase">{selectedCategory}</Text>
            <p className={`text-md px-4 ${montserrat.className}`}>({product_count} products)</p>
            </div>
            <p className={`text-lg text-gray-500 mt-2 ${montserrat.className}`}>{description}</p>
            </div>
        </div>
    );
}

export const CategoryBannerSkeleton = () => {
    return (
        <div className="w-full min-h-64 bg-gray-100 flex flex-col items-center justify-center mb-8 p-4 animate-pulse">
            <div className="w-full max-w-4xl">
            <div className="flex items-baseline">
            <div className="h-10 w-48 bg-gray-300 rounded mb-2" />
            </div>
            <div className="h-6 w-full bg-gray-300 rounded mt-2" />
            </div>
        </div>
    );
}