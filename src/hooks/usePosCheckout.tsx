import { useRef } from "react";
import { Terminal } from "@stripe/terminal-js";
import { useStripeTerminal } from "./useStripeTerminal";
import { createPosReader } from "@/utils/Pos/createPosReader";
import { CartProduct } from "@/types/Product";
import { UserProfile } from "@/types/User";

export const usePosCheckout = () => {
  const { initialize, discoverReaders, collectPayment, connectReader } =
    useStripeTerminal();
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

  async function checkout({
    subtotal,
    userProfile,
    cart,
    existing_order_id,
  }: {
    subtotal: number;
    userProfile: UserProfile | null;
    cart: CartProduct[];
    existing_order_id?: string;
  }) {
    await createPosReader();
    const terminal = await getTerminal();

    if (!terminal) {
      throw new Error("Terminal not initialized");
    }

    const readers = await discoverReaders(terminal);

    if (readers.length === 0) {
      throw new Error("No readers found");
    }

    await connectReader({ discoveredReaders: readers, terminal });

    const intent = await collectPayment({
      amount: subtotal * 100,
      terminal,
      options: {
        ...userProfile,
        existing_order_id,
        id: userProfile?.id || "guest",
      },
      orderItems: cart,
    });

    if (!intent.success) {
      throw new Error(intent.error || "Payment failed");
    }

    return intent;
  }

  return { checkout };
};
