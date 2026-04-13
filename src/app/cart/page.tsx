"use client";
import { useCart } from "@/components/client/Cart/CartContext";
import CartProduct from "@/components/client/Cart/CartProduct";
import CartSummary from "@/components/client/Cart/CartSummary";
import { Text } from "@/components/ds/Text";


export default function Page() {
  const { cart, getCartSubtotal } = useCart();
  const subtotal = getCartSubtotal();
  return (
    <>
      <div className="justify-center my-4 hidden sm:flex">
        <Text size="xl">Cart</Text>
      </div>

      <div className="flex flex-row-reverse p-4 justify-center gap-4 items-start flex-wrap sm:flex-wrap md:flex-wrap lg:flex-nowrap">
        <CartSummary cartSubtotal={subtotal} />
        <div>
          {cart.map((product, index) => (
            <CartProduct key={index} {...product} />
          ))}
        </div>
      </div>
    </>
  );
}
