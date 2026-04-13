"use client";
import { Stack } from "@/components/ds/Stack";
import { Text } from "@/components/ds/Text";
import { checkout } from "@/hooks/useStripe";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import useHandleCheckout from "@/hooks/useHandleCheckout";

export default function CartSummary({
  cartSubtotal,
}: {
  cartSubtotal: number;
}) {
  const shipping = 4;
  const orderTotal = formatPrice(shipping + cartSubtotal);
  const router = useRouter();
  const {cart} = useCart()
  const {formatBody} = useHandleCheckout()
  const body = formatBody(
    cart,
    900,
  );
  const handleCheckout = async () => {
    const session = await checkout(body)
    if (session.url) router.push(session.url);
  }
  return (
    <Stack
      direction="col"
      className="bg-gray-100 min-h-64 w-full sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg p-4 my-4"
      gap="sm"
    >
      <Text size="lg" className="mb-4">
        Order Summary
      </Text>
      <Stack justify="between" className="w-full">
        <Text size="md">Subtotal</Text>
        <Text size="md">{formatPrice(cartSubtotal)}</Text>
      </Stack>
      <div className="w-full h-px bg-gray-300 my-2" />

      <Stack justify="between" className="w-full">
        <Text size="md">Shipping estimate</Text>
        <Text size="md">$4.99</Text>
      </Stack>
      <div className="w-full h-px bg-gray-300 my-2" />

      <Stack justify="between" className="w-full">
        <Text size="lg" className="mt-4">
          Order total
        </Text>
        <Text size="lg" className="mt-4">
          {orderTotal}
        </Text>
      </Stack>
      <button
        type="button"
        onClick={handleCheckout}
        className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 mt-4"
      >
        <Text size="md">Checkout</Text>
      </button>
    </Stack>
  );
}
