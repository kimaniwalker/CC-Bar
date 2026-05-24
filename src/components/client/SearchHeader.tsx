"use client";

import { LucideSearch } from "lucide-react";
import { Input } from "../ds/Input";
import { useRouter } from "next/navigation";
import React from "react";

export const SearchHeader = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  return (
    <div className="flex items-center justify-between p-2 gap-1 md:hidden">
      <LucideSearch className="text-gray-500 mr-4" size={20} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/shop?query=${query}`);
        }}
        className="w-full"
      >
        <Input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more ..."
          className="w-full max-w-md"
        />
      </form>
    </div>
  );
};
