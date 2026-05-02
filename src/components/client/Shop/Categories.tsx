import { CategoryNav } from "./CategoryNav"
import { getCategories } from "@/utils/server/getCategories";

export const Categories = async ({selectedCategory}:{selectedCategory: string}) => {
    const data = await getCategories()
    const categories = data?.map(c => c.name) ?? [];
    return <CategoryNav selectedCategory={selectedCategory} categories={categories} />
}

export const CategorySkeleton = () => {
    return (
        <nav className="flex space-x-4 overflow-x-auto py-4 bg-gray-100 items-center justify-center w-full">  
        <ul className="flex space-x-8 overflow-x-auto px-4 scrollbar-hide">
          {Array.from({ length: 8 }).map((_, i) => (
           <li
           className={`h-6 w-24 rounded bg-gray-300 animate-pulse`}
           key={i}
         />
          ))}
          </ul>
        </nav>
    );
}