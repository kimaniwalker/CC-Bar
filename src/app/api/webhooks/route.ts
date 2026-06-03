import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { handleReservationCheckout } from "@/utils/Cart/handleReservationCheckout";
import { handleShopCheckout } from "@/utils/Cart/handleShopCheckout";
import { CheckoutType } from "@/types/Reservations";
import { handleInStoreCheckout } from "@/utils/Pos/handleInStoreCheckout";
import { withRewards } from "@/utils/Rewards/withRewards";
import { RewardActionKey } from "@/types/Rewards";
import { handleUpdateSubscriptionBySubscriptionId } from "@/utils/Subscriptions/handleUpdateSubscriptionBySubscriptionId";
import { SubscriptionStatus } from "@/types/Subscriptions";

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
          await handleShopCheckout(session);
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

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription event (${event.type}):`, subscription.id);

        // Fetch the full subscription data to ensure we have current_period_end
        const fullSubscription = await stripe.subscriptions.retrieve(
          subscription.id,
        );

        let status: SubscriptionStatus;
        if (fullSubscription.cancel_at) {
          status = SubscriptionStatus.CANCELED;
        } else {
          status = fullSubscription.status as SubscriptionStatus;
        }

        await handleUpdateSubscriptionBySubscriptionId({
          subscriptionId: subscription.id as string,
          status,
          next_renewal: null,
          cancel_at: fullSubscription.cancel_at
            ? new Date(fullSubscription.cancel_at * 1000).toISOString()
            : null,
        });

        break;
      }

      case "invoice.paid":
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
          const subscriptionId =
            invoice.parent.subscription_details.subscription;

          await handleUpdateSubscriptionBySubscriptionId({
            subscriptionId,
            status: SubscriptionStatus.ACTIVE,
            next_renewal: new Date(invoice.period_end * 1000).toISOString(),
            cancel_at: null,
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
          const subscriptionId =
            invoice.parent.subscription_details.subscription;

          await handleUpdateSubscriptionBySubscriptionId({
            subscriptionId,
            status: invoice.status ?? SubscriptionStatus.PAST_DUE,
            next_renewal: new Date(invoice.period_end * 1000).toISOString(),
            cancel_at: null,
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
