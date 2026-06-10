import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { handleReservationCheckout } from "@/utils/Cart/handleReservationCheckout";
import { handleShopCheckout } from "@/utils/Cart/handleShopCheckout";
import { handleShopSubscription } from "@/utils/Subscriptions/handleShopSubscription";
import { CheckoutType } from "@/types/Reservations";
import { handleInStoreCheckout } from "@/utils/Pos/handleInStoreCheckout";
import { withRewards } from "@/utils/Rewards/withRewards";
import { RewardActionKey } from "@/types/Rewards";
import { SubscriptionStatus } from "@/types/Subscriptions";
import { calculateNextRenewalDate } from "@/utils/Subscriptions/calculateNextRenewalDate";
import { handleUpdateSubscription } from "@/utils/Subscriptions/handleUpdateSubscription";

// @ts-expect-error - The stripe terminal library expects a config param here which we can ignore.
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
          // Handle subscription checkouts
          if (session.mode === "subscription") {
            await handleShopSubscription(session.id);
          } else {
            // Handle regular shop checkouts
            await handleShopCheckout(session);
          }
          break;
        }

        console.warn("Unknown checkout type:", type);
        break;
      }

      case "payment_intent.succeeded": {
        const idempotency_key = event.id;
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { type, user_id } = paymentIntent.metadata || {};

        if (type === CheckoutType.IN_STORE) {
          await withRewards(
            RewardActionKey.PURCHASE,
            async () => {
              await handleInStoreCheckout(paymentIntent);
            },
            user_id ?? "guest",
            idempotency_key,
          );
        }
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      // Only handle subscription status changes (not creation)
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription event (${event.type}):`, subscription.id);

        // Fetch the full subscription data
        const fullSubscription = await stripe.subscriptions.retrieve(
          subscription.id,
        );

        let status: SubscriptionStatus;
        if (fullSubscription.cancel_at) {
          status = SubscriptionStatus.CANCELED;
        } else if (fullSubscription.pause_collection?.behavior === "void") {
          status = SubscriptionStatus.PAUSED;
        } else {
          status = fullSubscription.status as SubscriptionStatus;
        }

        await handleUpdateSubscription({
          subscription_id: subscription.id,
          status,
          next_renewal: calculateNextRenewalDate(),
          cancel_at: fullSubscription.cancel_at
            ? new Date(fullSubscription.cancel_at * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & {
          parent?: {
            type: string;
            subscription_details?: {
              subscription: string;
            };
          };
        };

        if (
          invoice.parent?.type === "subscription_details" &&
          invoice.parent.subscription_details
        ) {
          const subscription_id =
            invoice.parent.subscription_details.subscription;
          await handleUpdateSubscription({
            subscription_id,
            status: SubscriptionStatus.ACTIVE,
            next_renewal: calculateNextRenewalDate(),
            cancel_at: null,
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & {
          parent?: {
            type: string;
            subscription_details?: {
              subscription: string;
            };
          };
        };

        if (
          invoice.parent?.type === "subscription_details" &&
          invoice.parent.subscription_details
        ) {
          const subscription_id =
            invoice.parent.subscription_details.subscription;

          await handleUpdateSubscription({
            subscription_id,
            status: SubscriptionStatus.PAST_DUE,
            next_renewal: calculateNextRenewalDate(),
            updated_at: new Date().toISOString(),
          });
        }
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
