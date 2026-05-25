"use server";

import Stripe from "stripe";

export const createPosReader = async () => {
  // @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const location = await stripe.terminal.locations.create({
      display_name: "HQ",
      address: {
        line1: "4052 Helena Rd",
        city: "Helena",
        state: "AL",
        country: "US",
        postal_code: "35080",
      },
    });

    const reader = await stripe.terminal.readers.create({
      registration_code: "simulated-wpe",
      label: "CC-BAR Terminal",
      location: location.id,
    });
    return JSON.parse(JSON.stringify(reader));
  } catch (err) {
    console.error("Error creating POS reader:", err);
    throw new Error("Failed to create POS reader");
  }
};
