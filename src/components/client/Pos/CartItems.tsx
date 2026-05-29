import { Text } from "@/components/ds/Text";
import { CartProduct } from "@/types/Product";

interface CartItemsProps {
  cart: CartProduct[];
  onAddToCart: (item: CartProduct) => void;
  onDecreaseQuantity: (sku: string) => void;
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
      {cart.map((item) => (
        <CartItem
          key={item.sku}
          item={item}
          onIncrease={() => onAddToCart(item)}
          onDecrease={() => onDecreaseQuantity(item.sku)}
        />
      ))}
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
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4">
      <div className="flex flex-col gap-1">
        <Text size="md" className="text-sm font-semibold">
          {item.name}
        </Text>
        <Text size="sm">
          ${item.price.toFixed(2)} × {item.quantity}
        </Text>
        {item.color && (
          <Text size="sm" className="capitalize">
            Color: {item.color}
          </Text>
        )}
        {item.size && (
          <Text size="sm" className="capitalize">
            Size: {item.size}
          </Text>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="rounded-full bg-neutral-200 px-3 py-1 text-sm transition hover:bg-neutral-300"
        >
          -
        </button>
        <Text size="md" className="text-sm">
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
