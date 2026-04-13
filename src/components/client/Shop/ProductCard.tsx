"use client";
import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProductCardQuickAdd from "./ProductCardQuickAdd";
import { useMediaQuery } from "react-responsive";
import ProductCount from "./ProductCount";
import { Product } from "@/types/Product";

export default function ProductCard(product: Product) {
  const isMobile = useMediaQuery({
    query: "(max-width: 1279px)",
  });
  const [hideQuickAdd, setHideQuickAdd] = useState(true);
  const { id, name, price, thumbnail } = product;

  useEffect(() => {
    if (isMobile) {
      setHideQuickAdd(false);
    } else setHideQuickAdd(true);
  }, [isMobile]);
  return (
    <>
      <div
        onMouseEnter={() => setHideQuickAdd(false)}
        onMouseLeave={() => setHideQuickAdd(true)}
      >
        <a key={id} className="group">
          <Stack className="relative h-35 w-35 sm:h-50 sm:w-50 md:h-60 md:w-60 aspect-square bg-gray-200 group-hover:opacity-75 rounded-xl overflow-hidden">
            <Image
              alt={name}
              src={thumbnail}
              fill
              style={{ objectFit: "cover" }}
              sizes="(min-width: 768px) 240px, (min-width: 640px) 200px, 140px"
            />
            <ProductCardQuickAdd
              hideQuickAdd={hideQuickAdd}
              product={product}
            />
            <ProductCount id={id} />
          </Stack>
          <Stack direction="col">
            <Text size="sm" className="mt-4 text-gray-700 w-35 sm:w-50 md:w-60">
              {name}
            </Text>

            <Text size="lg" className="mt-1 text-gray-900">
              ${price}
            </Text>
          </Stack>
        </a>
      </div>
    </>
  );
}
