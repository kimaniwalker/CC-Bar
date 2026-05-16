"use client"
import { Text } from "@/components/ds/Text";
import { useCart } from "./CartContext";
import CartProduct from "@/components/client/Cart/CartProduct";
import { CloseIcon } from "@/components/ds/CloseIcon";
import { AnimatePresence, motion } from "motion/react";
import useStripe from "@/hooks/useStripe";
import useHandleCheckout from "@/hooks/useHandleCheckout";
import { useRouter, usePathname } from "next/navigation";
import { validateStock } from "@/utils/server/validateProductStock";
import React from "react";
import { StockError } from "@/types/Product";
import { montserrat } from "@/components/ds/Fonts";
import { useUser } from "../Auth/AuthContext";


export const CartDrawer = ({ onClose }: { onClose: () => void }) => {
    const { cart, getTotalCartQuantity, getCartSubtotal } = useCart();
    const [errors, setErrors] = React.useState<StockError[]>([]);
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useUser()
    console.log({user})
    const { formatBody } = useHandleCheckout()
    const body = formatBody(cart, 900, pathname, user)
    console.log({body})

       
    const { checkout } = useStripe()
    const cartQuanity = getTotalCartQuantity();
    const cartSubtotal = getCartSubtotal();
    const handleCheckout = async () => {
        // 👇 check stock first
        const { valid, errors } = await validateStock(cart);

        if (!valid) {
            setErrors(errors)
            return { success: false, errors };  // 👈 return errors to client
        }
        if (valid) {
            console.log("Stock valid, proceeding to checkout...");
            const session = await checkout(body)
            if (session.url) router.push(session.url);
        }
        
    }

    const handleClearError = (sku: string) => {
        const filteredErrors = errors.filter((e) => e.sku !== sku);
        setErrors(filteredErrors);
    }
       
    return (
        <AnimatePresence>
            <motion.div
                transition={{ type: "spring", duration: 1 }}
            >
                <div className="fixed top-0 right-0 w-full sm:w-128 h-full bg-white shadow-lg z-100 p-4">
                    <div className="flex flex-col">
                        <Text as="h2" size="lg" className="text-2xl font-bold mb-4">Your Cart ({cartQuanity}) - ${cartSubtotal}</Text>
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
                                <CartProduct key={index} product={product} errors={errors} onHandleUpdateProductQuantity={(sku) => handleClearError(sku)}  />
                            ))
                        }
                    </div>
                    <Text size="lg" className="text-2xl font-bold mb-2 py-2">
                        Disclaimer
                    </Text>
                    <Text size="sm" className={`text-sm font-bold mb-4`}>
                    Free shipping on orders over $75 • Handmade to order • Ships in 3–5 business days
                    </Text>
                    <button
                        onClick={handleCheckout}
                        type="button"
                        disabled={errors.length > 0}
                        className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 mt-4 w-full disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                    >
                        <Text as="span" size="sm" className="uppercase text-lg">Checkout</Text>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}