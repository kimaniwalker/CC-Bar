"use client";

import { Stack } from "../ds/Stack";
import Image from "next/image";
import { CartDrawer } from "./Cart/CartDrawer";
import CartModal from "./CartModal";
import { useCartModal } from "./CartModalContext";
import { useCart } from "./Cart/CartContext";
import { SearchInput } from "./SearchInput";
import { usePathname, useRouter } from "next/navigation";
import { SearchHeader } from "./SearchHeader";
import { MenuIcon, Search, ShoppingCart } from "lucide-react";
import React from "react";
import { Navbar } from "./Navbar";
import { Text } from "../ds/Text";

export default function Header() {
  const { open, isOpen, close } = useCartModal();
  const { getTotalCartQuantity } = useCart();
  const cartQuanity = getTotalCartQuantity();
  const router = useRouter();
  const [searchBarVisible, setSearchBarVisible] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const path = usePathname();

  if (path === "/pos") {
    return null;
  }

  return (
    <>
      {searchBarVisible && <SearchHeader />}
      <Stack justify="between" className="bg-black px-4 py-2 sticky top-0 z-99">
        <div className="flex items-center gap-4 cursor-pointer">
          <MenuIcon
            color="white"
            size={32}
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          />
          <Navbar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <Image
            src="/logorevamp.png"
            alt="Logo"
            width={75}
            height={75}
            sizes="150px"
            priority
            className="hidden md:flex"
            onClick={() => router.push("/")}
          />
          <Search
            color="white"
            size={32}
            className="md:hidden"
            onClick={() => setSearchBarVisible(!searchBarVisible)}
          />
        </div>
        <Image
          src="/logorevamp.png"
          alt="Logo"
          width={75}
          height={75}
          sizes="150px"
          priority
          className="md:hidden flex"
          onClick={() => router.push("/")}
        />
        <SearchInput />
        <button onClick={open} className="relative">
          <ShoppingCart color="white" size={32} className="" />
          <span className="absolute top-1 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs z-101">
            <Text size="md">{cartQuanity}</Text>
          </span>
        </button>
      </Stack>
      <CartModal isOpen={isOpen} onClose={close}>
        <CartDrawer onClose={close} />
      </CartModal>
    </>
  );
}
