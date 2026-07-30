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
import { getSubscriptionUserId } from "@/utils/Subscriptions/getSubscriptionUserId";

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
        console.log("Checkout session completed:", session.id, "Type:", type);

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
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription updated:`, subscription.id);
        const user_id = await getSubscriptionUserId(subscription.id);

        // Fetch the full subscription data
        const fullSubscription = await stripe.subscriptions.retrieve(
          subscription.id,
        );

        let status: SubscriptionStatus;
        let pauseScheduledAt: string | null = null;
        const now = Date.now();
        const currentPeriodEnd = new Date(calculateNextRenewalDate()).getTime();
        // Check if subscription is scheduled to cancel (has cancel_at in the future)
        const hasScheduledCancellation =
          fullSubscription.cancel_at &&
          fullSubscription.cancel_at * 1000 > Date.now();

        // Check if paused
        const isPaused = fullSubscription.pause_collection?.behavior === "void";
        const pauseResumesAt = fullSubscription.pause_collection?.resumes_at;

        // User is paused BUT current period hasn't ended yet (they paid for this month)
        const isPausedButStillActive = isPaused && now < currentPeriodEnd;

        if (isPausedButStillActive) {
          // Pause is scheduled but not active yet - keep benefits active
          status = SubscriptionStatus.ACTIVE;
          pauseScheduledAt = new Date(currentPeriodEnd).toISOString();
        } else if (isPaused) {
          // Period ended, now actually paused
          status = SubscriptionStatus.PAUSED;
          pauseScheduledAt = null;
        } else if (hasScheduledCancellation) {
          // Subscription is active but scheduled to cancel
          status = SubscriptionStatus.ACTIVE;
        } else {
          status = fullSubscription.status as SubscriptionStatus;
        }

        await handleUpdateSubscription({
          subscription_id: subscription.id,
          status,
          next_renewal: pauseResumesAt
            ? new Date(pauseResumesAt * 1000).toISOString()
            : new Date(calculateNextRenewalDate()).toISOString(),
          cancel_at: fullSubscription.cancel_at
            ? new Date(fullSubscription.cancel_at * 1000).toISOString()
            : null,
          pause_scheduled_at: pauseScheduledAt,
          updated_at: new Date().toISOString(),
          user_id,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription deleted:`, subscription.id);
        const user_id = await getSubscriptionUserId(subscription.id);

        // Subscription has actually ended - fully canceled
        await handleUpdateSubscription({
          subscription_id: subscription.id,
          status: SubscriptionStatus.CANCELED,
          next_renewal: null,
          updated_at: new Date().toISOString(),
          user_id,
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
          const user_id = await getSubscriptionUserId(subscription_id);
          await handleUpdateSubscription({
            subscription_id,
            status: SubscriptionStatus.ACTIVE,
            next_renewal: calculateNextRenewalDate(),
            cancel_at: null,
            updated_at: new Date().toISOString(),
            user_id,
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
          const user_id = await getSubscriptionUserId(subscription_id);

          await handleUpdateSubscription({
            subscription_id,
            status: SubscriptionStatus.PAST_DUE,
            next_renewal: calculateNextRenewalDate(),
            updated_at: new Date().toISOString(),
            user_id,
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
