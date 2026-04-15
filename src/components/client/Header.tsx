"use client";

import { Stack } from "../ds/Stack";
import Image from "next/image";
import { CartIcon } from "../ds/CartIcon"
import { CartDrawer } from "./Cart/CartDrawer";
import CartModal from "./CartModal";
import { useCartModal } from "./CartModalContext";
import { useCart } from "./Cart/CartContext";

export default function Header() {
  const {open , isOpen, close} = useCartModal()
  const {getTotalCartQuantity} = useCart()
  const cartQuanity = getTotalCartQuantity()
  return (
    <>
    
    <Stack justify="between" className="bg-black p-4 sticky top-0 z-99">
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
      <button onClick={open}>
      <CartIcon />
      </button>
    </Stack>
    <CartModal isOpen={isOpen} onClose={close}>
      <CartDrawer onClose={close} />
    </CartModal>
    </>
    
  );
}
