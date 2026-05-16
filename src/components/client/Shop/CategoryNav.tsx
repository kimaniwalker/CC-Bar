"use client"

import { Text } from "@/components/ds/Text";
import { useRouter } from "next/navigation";

export const CategoryNav = ({ categories, selectedCategory }: { categories: string[], selectedCategory: string }) => {
    const router = useRouter()
    const handleCategoryClick = (category: string) => {
        router.push(`/shop?category=${category}`);
    }
  return (
    <nav className="flex space-x-4 py-4 bg-gray-200 items-center justify-center w-full">  
    <ul className="flex space-x-8 overflow-x-auto px-4 scrollbar-hide">
      {categories.map((category) => (
       <li
       className={`cursor-pointer text-center text-nowrap text-sm uppercase transition-all duration-200 ${
         category === selectedCategory
           ? "font-black underline underline-offset-4 decoration-4 scale-110"
           : "font-normal opacity-60 hover:opacity-100"
       }`}
       key={category}
       onClick={() => handleCategoryClick(category)}
     >
       <Text as="span" size="sm">{category}</Text>
     </li>
      ))}
      </ul>
    </nav>
  );
}