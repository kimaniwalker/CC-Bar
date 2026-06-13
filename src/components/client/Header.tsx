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
import { MenuIcon, Search, ShoppingCart, UserCog2Icon } from "lucide-react";
import React, { Suspense } from "react";
import { Navbar } from "./Navbar";
import { Text } from "../ds/Text";

function HeaderContent() {
  const { open, isOpen, close } = useCartModal();
  const { getTotalCartQuantity } = useCart();
  const cartQuanity = getTotalCartQuantity();
  const router = useRouter();
  const [searchBarVisible, setSearchBarVisible] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const path = usePathname(); // This is line 18 - the problem

  if (path === "/pos") {
    return null;
  }

  return (
    <>
      {searchBarVisible && <SearchHeader />}
      <div className="w-full bg-black">
        <Stack
          justify="between"
          className="bg-black py-2 sticky top-0 z-98 w-full mx-auto max-w-2xl px-4  sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <div className="flex items-center gap-4 cursor-pointer">
            <MenuIcon
              color="white"
              size={32}
              className=""
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
          <div className="flex gap-4 items-center">
            <UserCog2Icon
              color="white"
              size={32}
              onClick={() => router.push("/auth/login")}
            />
            <button onClick={open} className="relative">
              <ShoppingCart color="white" size={32} className="" />
              <span className="absolute bottom-5 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs z-101">
                <Text size="md">{cartQuanity}</Text>
              </span>
            </button>
          </div>
        </Stack>
        <CartModal isOpen={isOpen} onClose={close}>
          <CartDrawer onClose={close} />
        </CartModal>
      </div>
    </>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <Stack
          justify="between"
          className="bg-black px-4 py-2 sticky top-0 z-99"
        >
          <div className="w-20" />
          <Image
            src="/logorevamp.png"
            alt="Logo"
            width={75}
            height={75}
            sizes="150px"
            priority
          />
          <div className="w-8 h-8" />
        </Stack>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
