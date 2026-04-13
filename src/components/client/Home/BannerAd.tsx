import { Stack } from "@/components/ds/Stack";
import Image from "next/image";
import React from "react";

export default function BannerAd({ rotate }: { rotate?: boolean }) {
  return (
    <Stack
      className={`relative w-full lg:h-192 md:h-120 h-80 ${
        rotate && "rotate-180"
      }`}
    >
      <Image
        priority
        src="/wavy.png"
        alt="image"
        fill
        style={{ objectFit: "cover" }}
      />
    </Stack>
  );
}
