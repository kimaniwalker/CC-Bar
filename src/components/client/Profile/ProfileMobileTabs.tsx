"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ProfileMobileTabs = () => {
  const navItems = [
    { key: "overview", label: "Overview" },
    { key: "orders", label: "Orders" },
    { key: "favorites", label: "Favorites" },
    { key: "profile", label: "Profile" },
  ];

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const section = params.get("section") ?? "overview";

  return (
    <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
      <div className="flex gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            onClick={() => router.push(`${pathname}?section=${item.key}`)}
            key={item.label}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              item.key === section
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
