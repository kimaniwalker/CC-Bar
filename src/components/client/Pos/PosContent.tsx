"use client";

import { useSearchParams } from "next/navigation";
import { Text } from "@/components/ds/Text";
import { Input } from "@/components/ds/Input";
import { usePosCart } from "@/hooks/usePosCart";
import { useModal } from "@/components/client/ModalContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePosCheckout } from "@/hooks/usePosCheckout";
import { normalizeCartProduct } from "@/utils/Cart/normalizeCartProduct";
import { ProductWithOptions } from "@/types/Product";
import PosVariationsModal from "./PosVariationsModal";
import { CartSidebar } from "./CartSidebar";
import { ProductGrid } from "./ProductGrid";
import { AddressCollectorModal } from "./AddressCollectorModal";
import { useReservationContext } from "@/hooks/useReservationContext";
import { ReservationBanner } from "../Reservations/ReservationBanner";

export default function PosContent({
  products,
}: {
  products: ProductWithOptions[];
}) {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const reservation_id = searchParams.get("reservation_id");

  const {
    cart,
    search,
    setSearch,
    filteredProducts,
    loading,
    subtotal,
    addToCart,
    decreaseQuantity,
    setCart,
  } = usePosCart(products);

  const { userProfile, profileLoading, setUserProfile } =
    useUserProfile(user_id);

  const {
    reservation,
    order,
    loading: reservationLoading,
  } = useReservationContext(reservation_id);

  const { checkout, isReaderConnected, readerError, isConnecting } =
    usePosCheckout();
  const { open } = useModal();

  const handleCheckout = async () => {
    try {
      if (user_id && !userProfile?.shipping_address) {
        alert("Please add a shipping address before checkout.");
        handleOpenAddressCollector();
        return;
      }

      // Pass existing order ID if this is a reservation
      await checkout({
        subtotal,
        userProfile,
        cart,
        existing_order_id: order?.id,
      });

      alert(
        order?.id
          ? "Reservation completed! Items have been added to the order."
          : "Payment successful! Thank you for your purchase.",
      );
      setCart([]);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred during checkout. Please try again.",
      );
    }
  };

  const handleAddToCart = (product: ProductWithOptions) => {
    // Check if product has option groups
    const hasOptions = !!product.product_option_groups?.some((group) =>
      group.product_options.some((opt) => opt.active),
    );

    if (hasOptions) {
      open(
        <PosVariationsModal
          product={product}
          onAddToCart={addToCart}
          cart={cart}
        />,
        {},
      );
      return;
    }

    // Add simple product without options
    addToCart(
      normalizeCartProduct(product, {
        quantity: 1,
        selected_options: undefined,
      }),
    );
  };

  const handleOpenAddressCollector = () => {
    open(
      <AddressCollectorModal
        user_id={user_id ?? "guest"}
        onSave={(updatedProfile) => setUserProfile(updatedProfile)}
      />,
      { maxWidth: "2xl" },
    );
  };
  if (isConnecting || !isReaderConnected || readerError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Text
          size="md"
          className={readerError ? "text-red-600" : "text-neutral-700"}
        >
          {isConnecting
            ? "Connecting to the card reader..."
            : readerError
              ? `Error connecting to the card reader: ${readerError}`
              : "Card reader not connected. Please check the connection."}
        </Text>
      </div>
    );
  }
  return (
    <div className="grid min-h-screen grid-cols-1 bg-neutral-100 lg:grid-cols-[1fr_400px]">
      {/* Products Section */}
      <div className="flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-neutral-100 p-6 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text size="md" className="font-semibold">
                CANDLE COW BAR
              </Text>
              <Text size="sm">Create and manage in-store orders.</Text>
            </div>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="max-w-sm bg-white"
            />
          </div>

          {/* Reservation Banner */}
          {reservation && order && (
            <ReservationBanner
              reservation={reservation}
              order={order}
              loading={reservationLoading}
            />
          )}
        </div>

        {/* Scrollable Products Grid */}
        <div className="overflow-auto p-6 pt-2">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onProductClick={handleAddToCart}
          />
        </div>
      </div>

      {/* Fixed Cart Sidebar */}
      <CartSidebar
        cart={cart}
        subtotal={subtotal}
        user_id={user_id}
        userProfile={userProfile}
        profileLoading={profileLoading}
        onAddToCart={addToCart}
        onDecreaseQuantity={decreaseQuantity}
        onCheckout={handleCheckout}
        onOpenAddressCollector={handleOpenAddressCollector}
      />
    </div>
  );
}
