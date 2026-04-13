import { Stack } from "@/components/ds/Stack";
import React from "react";

export default function ProductCardSkeleton() {
  return (
    <Stack direction="col">
      <div className="relative h-35 w-35 sm:h-50 sm:w-50 md:h-60 md:w-60 aspect-square bg-gray-200 group-hover:opacity-75 rounded-xl overflow-hidden animate-pulse"></div>
      <div className="mt-4 bg-gray-200 w-15 h-4 sm:w-50 md:w-48 animate-pulse rounded-xl"></div>
      <div className="mt-1 bg-gray-200 h-4 w-4 sm:w-6 md:w-8 animate-pulse rounded-xl"></div>
    </Stack>
  );
}
