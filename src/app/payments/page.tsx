"use client";

import { useRef } from "react";
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

export default function Page() {
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

      // 3. Collect payment
      const intent = await collectPayment({
        amount: 11999,
        terminal,
        options: { email: "kimaniwalker@gmail.com", store_reference: "cc bar" },
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
          onDecreaseQuantity={(sku) => decreaseQuantity(sku)}
          cart={cart}
        />,
      );
      return;
    }

    addToCart(normalizeCartProduct(product));
  };

  return (
    <>
      <div className="grid min-h-screen grid-cols-1 bg-neutral-100 lg:grid-cols-[1fr_400px]">
        {/* Products */}
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text size="md">Point of Sale</Text>
              <Text size="sm">Create and manage in-store orders.</Text>
            </div>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="max-w-sm bg-white"
            />
          </div>

          <div className="h-[calc(100vh-140px)]">
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

                      <Text size="sm">${(product.price / 100).toFixed(2)}</Text>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="flex h-screen flex-col border-l border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 p-6">
            <Text size="md">Current Order</Text>
          </div>

          <div className="flex-1">
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
                      <Text size="sm">{item.name}</Text>

                      <Text size="sm">
                        ${(item.price / 100).toFixed(2)} × {item.quantity}
                      </Text>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-300"
                        onClick={() => decreaseQuantity(item.sku)}
                      >
                        -
                      </button>

                      <Text size="sm">{item.quantity}</Text>

                      <button
                        className="rounded-full bg-neutral-200 px-2 py-1 text-sm transition hover:bg-neutral-300"
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

          <div className="flex flex-col gap-4 border-t border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <Text size="sm">Subtotal</Text>

              <Text size="sm">${(subtotal / 100).toFixed(2)}</Text>
            </div>

            <hr className="border-neutral-200" />

            <button
              className="h-14 rounded-2xl text-base bg-gray-50 font-medium transition hover:bg-gray-100  disabled:cursor-not-allowed disabled:bg-gray-200"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
