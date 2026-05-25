"use client";

import { CollectPaymentResult, PaymentState } from "@/types/Pos";
import { createPaymentIntent } from "@/utils/Pos/createPaymentIntent";
import { getConnectionToken } from "@/utils/Pos/getConnectionToken";
import type { PaymentIntent } from "@stripe/stripe-js";
import { loadStripeTerminal, Reader, Terminal } from "@stripe/terminal-js";

import React from "react";

export function useStripeTerminal() {
  const [paymentStatus, setPaymentStatus] =
    React.useState<PaymentState>("idle");

  async function initialize() {
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
  }

  async function discoverReaders(terminal: Terminal) {
    const discoverResult = await terminal.discoverReaders({
      simulated: true,
    });

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
  }

  async function connectReader({
    discoveredReaders,
    terminal,
  }: {
    discoveredReaders: Reader[];
    terminal: Terminal;
  }) {
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
  }

  async function collectPayment({
    amount,
    terminal,
    options,
  }: {
    amount: number;
    terminal: Terminal;
    options?: Record<string, string>;
  }): Promise<CollectPaymentResult> {
    setPaymentStatus("creating_intent");
    const clientSecret = await createPaymentIntent({ amount, options });

    if (!clientSecret) {
      console.error("Failed to create payment intent: clientSecret is null");
      setPaymentStatus("failed");
      throw new Error("Missing client secret");
    }

    await terminal.setSimulatorConfiguration({
      testCardNumber: "4242424242424242",
    });

    setPaymentStatus("awaiting_payment");
    const collectResult = await terminal.collectPaymentMethod(clientSecret);

    if ("error" in collectResult) {
      setPaymentStatus("failed");
      console.error("Failed to collect payment method:", collectResult.error);

      return {
        success: false,
        error:
          collectResult.error.message ?? "Failed to collect payment method",
      };
    }

    console.log("Collected payment method:", collectResult.paymentIntent);
    setPaymentStatus("processing");
    const processResult = await terminal.processPayment(
      collectResult.paymentIntent,
    );

    if ("error" in processResult) {
      console.error("Failed to process payment:", processResult.error);
      setPaymentStatus("failed");
      return {
        success: false,
        error: processResult.error.message ?? "Failed to process payment",
      };
    }

    if (!processResult.paymentIntent) {
      console.error("No payment intent returned.");
      setPaymentStatus("failed");
      return {
        success: false,
        error: "No payment intent returned.",
      };
    }

    console.log("Payment processed:", processResult.paymentIntent);
    setPaymentStatus("success");
    return {
      success: true,
      paymentIntent: processResult.paymentIntent as PaymentIntent,
    };
  }

  return {
    initialize,
    discoverReaders,
    connectReader,
    collectPayment,
    paymentStatus,
  };
}
