"use client";

import { Stack } from "../ds/Stack";
import Image from "next/image";
import { CartIcon } from "../ds/CartIcon"
import { CartDrawer } from "./Cart/CartDrawer";
import CartModal from "./CartModal";
import { useCartModal } from "./CartModalContext";
import { useCart } from "./Cart/CartContext";
import { SearchInput } from "./SearchInput";


export default function Header() {
  const {open , isOpen, close} = useCartModal()
  const {getTotalCartQuantity} = useCart()
  const cartQuanity = getTotalCartQuantity()
  
  return (
    <>
    {/* <div className="bg-black text-white p-4 text-center">Use code 'Candle Cow Co' for 15% off your next order.</div> */}
    <Stack justify="between" className="bg-black p-4 sticky top-0 z-99">
      <div className="relative w-[150px] h-[50px]">
        <Image
          src="/CCBAR-WHITE.png"
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
          sizes="150px"
          priority
        />
      </div>
      <SearchInput />
      <button onClick={open} className="relative">
      <span className="absolute -top-0 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-101">
        {cartQuanity}
      </span>
      <CartIcon />
      </button>
    </Stack>
    <CartModal isOpen={isOpen} onClose={close}>
      <CartDrawer onClose={close} />
    </CartModal>
    </>
    
  );
}
