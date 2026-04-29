"use client";

import { useRouter } from "next/navigation";
import React from "react";

export const SearchInput = () => {

    const [query, setQuery] = React.useState("");
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/shop?query=${query}`);
    }

  return (
    <div className="flex items-center justify-center w-full max-w-lg px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full px-4 py-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
      />
        </form>
    </div>
  );
}
