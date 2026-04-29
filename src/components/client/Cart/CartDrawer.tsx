"use client"
import { Text } from "@/components/ds/Text";
import { useCart } from "./CartContext";
import CartProduct from "@/components/client/Cart/CartProduct";
import { CloseIcon } from "@/components/ds/CloseIcon";
import { AnimatePresence, motion } from "motion/react";
import useStripe from "@/hooks/useStripe";
import useHandleCheckout from "@/hooks/useHandleCheckout";
import { useRouter, usePathname } from "next/navigation";

export const CartDrawer = ({onClose}: {onClose: ()=> void}) => {
    const { cart, getTotalCartQuantity, getCartSubtotal } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const {formatBody} = useHandleCheckout()
     const body = formatBody(
        cart,
        900,
        pathname
      );
      const {checkout} = useStripe()
      const cartQuanity = getTotalCartQuantity();
      const cartSubtotal = getCartSubtotal();
      const handleCheckout = async () => {
          const session = await checkout(body)
          if (session.url) router.push(session.url);
        }
  

    return (
        <AnimatePresence>    
        <motion.div
        transition={{ type: "spring", duration: 1 }}
>
        <div className="fixed top-0 right-0 w-full sm:w-128 h-full bg-white shadow-lg z-100 p-4">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Your Cart ({cartQuanity}) - ${cartSubtotal}</h2>
                <span className="">
                    <CloseIcon onClose={onClose} />
                </span>
            </div>
            <div className="flex-1 overflow-y-auto h-2/3">
            {cartQuanity === 0 ? (
                <div className="flex flex-col flex-wrap mt-4">
                    <Text size="lg">Your cart is empty</Text>
                </div>
            ) : 
            cart.map((product, index) => (
                <CartProduct key={index} {...product} />
            ))
        }
            </div>
            <div className="text-2xl font-bold mb-2">
                Disclaimer
            </div>
            <div className="text-sm font-bold mb-4">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, reprehenderit! Dicta impedit reprehenderit voluptas vitae! Nisi dignissimos odit vitae vero recusandae, ut ad quisquam excepturi expedita dolore pariatur blanditiis veniam.
            </div>
            <button
                onClick={handleCheckout}
                type="button"
                disabled={cartQuanity === 0}
                className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 mt-4 w-full"
                >
                <Text size="md">Checkout</Text>
            </button>
        </div>
        </motion.div>
                </AnimatePresence>
    )
}