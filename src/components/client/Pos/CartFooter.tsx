import { Text } from "@/components/ds/Text";
import { CartProduct } from "@/types/Product";

interface CartFooterProps {
  subtotal: number;
  cart: CartProduct[];
  profileLoading: boolean;
  onCheckout: () => void;
}

export const CartFooter = ({
  subtotal,
  cart,
  profileLoading,
  onCheckout,
}: CartFooterProps) => {
  const isDisabled = cart.length === 0 || profileLoading;

  return (
    <div className="flex flex-col gap-4 border-t border-neutral-200 p-6">
      <div className="flex items-center justify-between">
        <Text size="md" className="font-semibold">
          Subtotal
        </Text>
        <Text size="xxl">${subtotal.toFixed(2)}</Text>
      </div>

      <hr className="border-neutral-200" />

      <button
        onClick={onCheckout}
        disabled={isDisabled}
        className="h-14 rounded-2xl bg-gray-50 text-base font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200"
      >
        {profileLoading ? "Loading..." : "Checkout"}
      </button>
    </div>
  );
};
