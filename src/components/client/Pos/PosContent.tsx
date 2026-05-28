"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Text } from "@/components/ds/Text";
import { Input } from "@/components/ds/Input";
import { useStripeTerminal } from "@/hooks/useStripeTerminal";
import { createPosReader } from "@/utils/Pos/createPosReader";
import { normalizeCartProduct } from "@/utils/Cart/normalizeCartProduct";
import { usePosCart } from "@/hooks/usePosCart";
import { Terminal } from "@stripe/terminal-js";
import { Product } from "@/types/Product";
import { useModal } from "@/components/client/ModalContext";
import PosVariationsModal from "@/components/client/Pos/PosVariationsModal";
import { useSearchParams } from "next/navigation";
import { AddressCollectorModal } from "@/components/client/Pos/AddressCollectorModal";
import { UserProfile } from "@/types/User";
import { getProfile } from "@/utils/User/getProfile";

export default function PosContent() {
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
  } = usePosCart();
  const { initialize, discoverReaders, collectPayment, connectReader } =
    useStripeTerminal();
  const { open } = useModal();
  const searchParams = useSearchParams();

  const user_id = searchParams.get("user_id");

  // 👇 Add user profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // 👇 Fetch user profile on mount
  useEffect(() => {
    async function loadUserProfile() {
      if (!user_id) return;

      setProfileLoading(true);
      try {
        const data = await getProfile(user_id);
        setUserProfile(data[0] || null);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setProfileLoading(false);
      }
    }

    loadUserProfile();
  }, [user_id]);

  const terminalRef = useRef<Terminal | null>(null);
  async function getTerminal() {
    if (terminalRef.current) {
      return terminalRef.current;
    }
    const instance = await initialize();
    if (!instance) {
      throw new Error("Failed to initialize terminal");
    }
    terminalRef.current = instance;
    return instance;
  }

  const handleCheckout = async () => {
    try {
      // Validate address before payment
      if (user_id && !userProfile?.shipping_address) {
        alert("Please add a shipping address before checkout.");
        handleOpenAddressCollector();
        return;
      }

      await createPosReader();
      // 1. Discover readers
      const terminal = await getTerminal();

      if (!terminal) {
        alert("Terminal not initialized. Please try again.");
        return;
      }
      const readers = await discoverReaders(terminal);

      if (readers.length === 0) {
        alert("No readers found. Please connect a reader first.");
        return;
      }

      // 2. Connect to the first available reader (you can implement a selection UI if needed)
      await connectReader({ discoveredReaders: readers, terminal });

      // 👇 Pass user info to payment

      const intent = await collectPayment({
        amount: subtotal * 100,
        terminal,
        options: {
          ...userProfile,
          id: userProfile?.id || "guest",
        },
        orderItems: cart,
      });

      if (!intent.success) {
        alert(`Payment failed: ${intent.error}`);
        return;
      }
      // 4. Handle post-payment logic (e.g., clear cart, show success message)
      // Clear cart logic here if needed
      alert("Payment successful! Thank you for your purchase.");
      setCart([]); // Clear the cart after successful payment
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const handleAddToCart = (product: Product) => {
    const hasVariants = product.available_colors || product.available_sizes;

    if (hasVariants) {
      open(
        <PosVariationsModal
          product={product}
          key={product.id}
          onAddToCart={(product) => addToCart(product)}
          cart={cart}
        />,
      );
      return;
    }

    addToCart(normalizeCartProduct(product));
  };

  const handleOpenAddressCollector = async () => {
    open(<AddressCollectorModal user_id={user_id ?? "guest"} />);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-neutral-100 lg:grid-cols-[1fr_400px]">
      {/* Products Section */}
      <div className="flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-neutral-100 p-6 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text size="md">CANDLE COW BAR</Text>
              <Text size="sm">Create and manage in-store orders.</Text>
            </div>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="max-w-sm bg-white"
            />
          </div>
        </div>

        {/* Scrollable Products Grid */}
        <div className="overflow-auto p-6 pt-2">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-55 animate-pulse rounded-3xl bg-neutral-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-square bg-neutral-200">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <Text size="sm">{product.name}</Text>
                    <Text size="sm">${product.price.toFixed(2)}</Text>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Cart Sidebar */}
      <div className="z-999 fixed right-0 top-0 h-screen w-full lg:w-100 flex flex-col border-l border-neutral-200 bg-white">
        {/* Cart Header */}
        <div className="border-b border-neutral-200 p-6">
          <Text size="md">Current Order</Text>

          {user_id && (
            <>
              {profileLoading ? (
                <div className="mt-2 flex flex-col gap-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 h-10 w-full animate-pulse rounded-2xl bg-neutral-200" />
                </div>
              ) : (
                <>
                  <Text size="sm" className="mt-2">
                    Customer -{" "}
                    {userProfile
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : user_id}
                  </Text>

                  <div className="mt-4">
                    <button
                      onClick={handleOpenAddressCollector}
                      className={`w-full rounded-2xl py-2 px-4 text-sm font-medium transition ${
                        userProfile?.shipping_address
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      {userProfile?.shipping_address
                        ? "✓ Address verified"
                        : "⚠ Add shipping address"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col gap-4 p-6">
            {cart.length === 0 ? (
              <Text size="sm">No products selected.</Text>
            ) : (
              cart.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <Text size="md" className="font-semibold text-sm">
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
                      className="rounded-full bg-neutral-200 px-3 py-1 text-sm transition hover:bg-neutral-300"
                      onClick={() => decreaseQuantity(item.sku)}
                    >
                      -
                    </button>
                    <Text size="md" className="text-sm">
                      {item.quantity}
                    </Text>
                    <button
                      className="rounded-full bg-neutral-200 px-3 py-1 text-sm transition hover:bg-neutral-300"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fixed Cart Footer */}
        <div className="flex flex-col gap-4 border-t border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <Text size="md" className="font-semibold">
              Subtotal
            </Text>
            <Text size="xxl">${subtotal.toFixed(2)}</Text>
          </div>

          <hr className="border-neutral-200" />

          <button
            className="h-14 rounded-2xl text-base bg-gray-50 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
