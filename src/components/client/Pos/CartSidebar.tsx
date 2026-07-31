"use client";

import { Text } from "@/components/ds/Text";
import { CartProduct } from "@/types/Product";
import { UserProfile } from "@/types/User";
import { UserProfileSection } from "./UserProfileSection";
import { CartItems } from "./CartItems";
import { CartFooter } from "./CartFooter";

interface CartSidebarProps {
  cart: CartProduct[];
  subtotal: number;
  user_id: string | null;
  userProfile: UserProfile | null;
  profileLoading: boolean;
  onAddToCart: (item: CartProduct) => void;
  onDecreaseQuantity: (sku: string) => void;
  onCheckout: () => void;
  onOpenAddressCollector: () => void;
}

export const CartSidebar = ({
  cart,
  subtotal,
  user_id,
  userProfile,
  profileLoading,
  onAddToCart,
  onDecreaseQuantity,
  onCheckout,
  onOpenAddressCollector,
}: CartSidebarProps) => {
  return (
    <div className="flex h-dvh w-full flex-col border-l border-neutral-200 bg-white lg:fixed lg:right-0 lg:top-0 lg:w-100">
      {/* Cart Header */}
      <div className="border-b border-neutral-200 p-6">
        <Text size="md">Current Order</Text>

        {user_id && (
          <UserProfileSection
            profileLoading={profileLoading}
            userProfile={userProfile}
            user_id={user_id}
            onOpenAddressCollector={onOpenAddressCollector}
          />
        )}
      </div>

      {/* Scrollable Cart Items */}
      <div className="flex-1 overflow-auto">
        <CartItems
          cart={cart}
          onAddToCart={onAddToCart}
          onDecreaseQuantity={onDecreaseQuantity}
        />
      </div>

      {/* Fixed Cart Footer */}
      <CartFooter
        subtotal={subtotal}
        cart={cart}
        profileLoading={profileLoading}
        onCheckout={onCheckout}
      />
    </div>
  );
};
