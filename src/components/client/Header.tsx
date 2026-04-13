"use client";
import React from "react";
import { Stack } from "../ds/Stack";
import Image from "next/image";

export default function Header() {
  return (
    <Stack justify="center" className="bg-black p-4 sticky top-0 z-99">
      <div className="relative w-[150px] h-[50px]">
        <Image
          src="/light.png"
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
          sizes="150px"
          priority
        />
      </div>
    </Stack>
  );
}
