"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { montserrat } from "../ds/Fonts";
import { Input } from "../ds/Input";
import { Search } from "lucide-react";

export const SearchInput = () => {
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/shop?query=${query}`);
  };

  return (
    <div className="items-center justify-center w-full max-w-lg px-8 hidden md:flex">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <Input
          leadingIcon={Search}
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          inputClassName={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black bg-white ${montserrat.className}`}
        />
      </form>
    </div>
  );
};
