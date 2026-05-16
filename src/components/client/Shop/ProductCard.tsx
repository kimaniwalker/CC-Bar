"use client";
import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import Image from "next/image";
import { useState } from "react";
import ProductCardQuickAdd from "./ProductCardQuickAdd";
import { useMediaQuery } from "react-responsive";
import ProductCount from "./ProductCount";
import { Product } from "@/types/Product";
import { useRouter } from "next/navigation";
import { ProductBadge } from "./ProductBadge";
import { ProductHeartButton } from "../Favorites/ProductHeartButton";

export default function ProductCard(product: Product) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, price, thumbnail } = product;
  const router = useRouter();
  const showQuickAdd = !isMobile && (isHovered); // 👈 never show on mobile


  return (
    <div
    onMouseEnter={() => { if (!isMobile) setIsHovered(true); }}   // 👈 ignore on mobile
    onMouseLeave={() => { if (!isMobile) setIsHovered(false); }}
    >
      <a className="group cursor-pointer" onClick={() => router.push(`/shop/${id}`)}>
        <Stack className="relative h-35 w-35 sm:h-50 sm:w-50 md:h-60 md:w-60 aspect-square bg-gray-200 group-hover:opacity-75 rounded-xl overflow-hidden">
          <Image
            alt={name}
            src={thumbnail}
            fill
            style={{ objectFit: "cover" }}
            sizes="(min-width: 768px) 240px, (min-width: 640px) 200px, 140px"
          />
          <ProductHeartButton product_id={product.id} />
            <ProductBadge stock={product.stock} />
          <div onClick={(e) => e.stopPropagation()}>
            <ProductCardQuickAdd hideQuickAdd={!showQuickAdd} product={product} />
          </div>
          <ProductCount id={id} />
        </Stack>
        <Stack direction="col">
          <Text size="sm" className="mt-4 text-gray-700 w-35 sm:w-50 md:w-60 line-clamp-1 text-ellipsis text-lg">
            {name}
          </Text>
          <Text size="md" className="mt-1 text-gray-900">
            ${price}
          </Text>
        </Stack>
      </a>
    </div>
  );
}