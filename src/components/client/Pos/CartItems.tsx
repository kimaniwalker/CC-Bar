import { Text } from "@/components/ds/Text";
import { CartProduct } from "@/types/Product";
import {
  calculateProductPrice,
  formatSelectedOptions,
  getCartProductKey,
} from "@/utils/Cart/normalizeCartProduct";

interface CartItemsProps {
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
  onDecreaseQuantity: (key: string) => void;
}

export const CartItems = ({
  cart,
  onAddToCart,
  onDecreaseQuantity,
}: CartItemsProps) => {
  if (cart.length === 0) {
    return (
      <div className="p-6">
        <Text size="sm" className="text-neutral-500">
          No products selected.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {cart.map((item) => {
        const cartKey = getCartProductKey(item);
        return (
          <CartItem
            key={cartKey}
            item={item}
            onIncrease={() => onAddToCart(item)}
            onDecrease={() => onDecreaseQuantity(cartKey)}
          />
        );
      })}
    </div>
  );
};

function CartItem({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartProduct;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  // Calculate price with options
  const itemPrice = calculateProductPrice(item);
  const totalPrice = itemPrice * item.quantity;

  // Format selected options for display
  const selectedOptionsText = formatSelectedOptions(item);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4">
      <div className="flex flex-col gap-1">
        <Text size="md" className="text-sm font-semibold">
          {item.name}
        </Text>

        {/* Display selected options */}
        {selectedOptionsText && (
          <Text size="sm" className="text-neutral-600">
            {selectedOptionsText}
          </Text>
        )}

        {/* Price display */}
        <Text size="sm" className="text-neutral-700">
          ${itemPrice.toFixed(2)} × {item.quantity} = ${totalPrice.toFixed(2)}
        </Text>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="rounded-full bg-neutral-200 px-3 py-1 text-sm transition hover:bg-neutral-300"
        >
          −
        </button>
        <Text size="md" className="text-sm font-semibold">
          {item.quantity}
        </Text>
        <button
          onClick={onIncrease}
          className="rounded-full bg-neutral-200 px-3 py-1 text-sm transition hover:bg-neutral-300"
        >
          +
        </button>
      </div>
    </div>
  );
}
