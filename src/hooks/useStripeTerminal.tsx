"use client";

import { CollectPaymentResult, PaymentState } from "@/types/Pos";
import { CartProduct } from "@/types/Product";
import { UserProfile } from "@/types/User";
import { createPaymentIntent } from "@/utils/Pos/createPaymentIntent";
import { getConnectionToken } from "@/utils/Pos/getConnectionToken";
import type { PaymentIntent } from "@stripe/stripe-js";
import { loadStripeTerminal, Reader, Terminal } from "@stripe/terminal-js";
import React, { useCallback } from "react";

export function useStripeTerminal() {
  const [paymentStatus, setPaymentStatus] =
    React.useState<PaymentState>("idle");

  const initialize = useCallback(async () => {
    const StripeTerminal = await loadStripeTerminal();

    if (!StripeTerminal) {
      throw new Error("Failed to load Stripe Terminal");
    }
    const terminal = StripeTerminal.create({
      onFetchConnectionToken: async () => {
        return await getConnectionToken();
      },
      onUnexpectedReaderDisconnect: () => {
        console.log("Reader disconnected");
      },
    });

    return terminal;
  }, []);

  const discoverReaders = useCallback(async (terminal: Terminal) => {
    const discoverResult = await terminal.discoverReaders({
      simulated: false,
      location: process.env.NEXT_PUBLIC_STRIPE_TERMINAL_LOCATION_ID,
    });

    console.log("Discover result:", discoverResult);

    if ("error" in discoverResult) {
      console.error("Failed to discover readers:", discoverResult.error);
      return [];
    }

    if (discoverResult.discoveredReaders.length === 0) {
      console.log("No available readers.");
      return [];
    }

    console.log("Discovered readers:", discoverResult.discoveredReaders);
    return discoverResult.discoveredReaders;
  }, []);

  const connectReader = useCallback(
    async ({
      discoveredReaders,
      terminal,
    }: {
      discoveredReaders: Reader[];
      terminal: Terminal;
    }) => {
      const selectedReader = discoveredReaders[0];

      if (!selectedReader) {
        console.log("No reader available to connect.");
        return null;
      }

      const connectResult = await terminal.connectReader(selectedReader);

      if ("error" in connectResult) {
        console.error("Failed to connect reader:", connectResult.error);
        return null;
      }

      console.log("Connected to reader:", connectResult.reader.label);
      return connectResult.reader;
    },
    [],
  );

  const collectPayment = useCallback(
    async ({
      amount,
      terminal,
      options,
      orderItems,
    }: {
      amount: number;
      terminal: Terminal;
      options?: UserProfile & { existing_order_id?: string };
      orderItems: CartProduct[];
    }): Promise<CollectPaymentResult> => {
      setPaymentStatus("creating_intent");
      const clientSecret = await createPaymentIntent({
        amount,
        options,
        orderItems,
      });

      if (!clientSecret) {
        setPaymentStatus("failed");
        throw new Error("Missing client secret");
      }

      /* await terminal.setSimulatorConfiguration({
        testCardNumber: "4242424242424242",
      }); */

      setPaymentStatus("awaiting_payment");
      const collectResult = await terminal.collectPaymentMethod(clientSecret);

      if ("error" in collectResult) {
        setPaymentStatus("failed");
        return {
          success: false,
          error:
            collectResult.error.message ?? "Failed to collect payment method",
        };
      }

      setPaymentStatus("processing");
      const processResult = await terminal.processPayment(
        collectResult.paymentIntent,
      );

      if ("error" in processResult) {
        setPaymentStatus("failed");
        return {
          success: false,
          error: processResult.error.message ?? "Failed to process payment",
        };
      }

      if (!processResult.paymentIntent) {
        setPaymentStatus("failed");
        return { success: false, error: "No payment intent returned." };
      }

      setPaymentStatus("success");
      return {
        success: true,
        paymentIntent: processResult.paymentIntent as PaymentIntent,
      };
    },
    [],
  );

  return {
    initialize,
    discoverReaders,
    connectReader,
    collectPayment,
    paymentStatus,
  };
}
