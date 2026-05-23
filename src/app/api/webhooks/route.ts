import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { handleReservationCheckout } from "@/utils/Cart/handleReservationCheckout";
import { handleShopCheckout } from "@/utils/Cart/handleShopCheckout";
import { CheckoutType } from "@/types/Reservations";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return new NextResponse("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_SHOP_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { type } = session.metadata || {};

        if (type === CheckoutType.RESERVATION) {
          await handleReservationCheckout(session);
          break;
        }

        if (type === CheckoutType.SHOP) {
          await handleShopCheckout(session);
          break;
        }

        console.warn("Unknown checkout type:", type);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error handling webhook event:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
