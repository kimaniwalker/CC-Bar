import { useRef, useEffect, useState } from "react";
import { Terminal } from "@stripe/terminal-js";
import { useStripeTerminal } from "./useStripeTerminal";
import { createPosReader } from "@/utils/Pos/createPosReader";
import { CartProduct } from "@/types/Product";
import { UserProfile } from "@/types/User";

export const usePosCheckout = () => {
  const { initialize, discoverReaders, collectPayment, connectReader } =
    useStripeTerminal();
  const terminalRef = useRef<Terminal | null>(null);
  const [isReaderConnected, setIsReaderConnected] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    async function connectOnMount() {
      setIsConnecting(true);
      try {
        const instance = await initialize();
        if (!instance) throw new Error("Failed to initialize terminal");
        terminalRef.current = instance;

        const readers = await discoverReaders(instance);

        if (readers.length === 0) {
          await createPosReader();
          const retried = await discoverReaders(instance);
          if (retried.length === 0) throw new Error("No readers found");
          await connectReader({
            discoveredReaders: retried,
            terminal: instance,
          });
        } else {
          await connectReader({
            discoveredReaders: readers,
            terminal: instance,
          });
        }

        setIsReaderConnected(true);
      } catch (err: unknown) {
        setReaderError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsConnecting(false);
      }
    }

    connectOnMount();
  }, [connectReader, discoverReaders, initialize]);

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
    const terminal = terminalRef.current;
    if (!terminal || !isReaderConnected)
      throw new Error("Reader not connected");

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

    if (!intent.success) throw new Error(intent.error || "Payment failed");

    return intent;
  }

  return { checkout, isReaderConnected, readerError, isConnecting };
};
