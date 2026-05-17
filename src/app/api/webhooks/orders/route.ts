import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { CheckoutType } from "@/types/Reservations";
import { handleAddNewOrder } from "@/utils/Orders/handleAddNewOrder";
import { ORDER_STATUS } from "@/types/Orders";
import { s } from "motion/react-client";
import { retreiveCheckoutSession } from "@/hooks/useStripe";


const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

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
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed.", err);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    try {
        switch (event.type) {
            // ...existing code...
            case "checkout.session.completed": {
                console.log("Checkout session completed event received");
                const  stripeSession = event.data.object as Stripe.Checkout.Session;
                const { session ,lineItems } = await retreiveCheckoutSession(stripeSession.id);
                const metadata = session.metadata;
                

                if (metadata?.type === CheckoutType.SHOP) {
                    console.log("Handling shop checkout session");
                    
                    
                    const newOrder = await handleAddNewOrder({order:{
                        id: session.id,
                        user_id: metadata.user_id,
                        stripe_payment_intent_id: String(session.payment_intent),
                        stripe_customer_id: String(session.customer), // Added stripe_customer_id
                        total: session.amount_total ?? 0,
                        subtotal: session.amount_subtotal ?? 0, // Added subtotal
                        shipping_total: session.total_details?.amount_shipping ?? 0, // Added shipping_total
                        status: ORDER_STATUS.CONFIRMED,
                        lineItems
                    }})
                    console.log({newOrder})
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