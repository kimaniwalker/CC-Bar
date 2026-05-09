import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/hooks/supabase/server";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature");
    const supabase = await createClient()

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
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata;

                if (!metadata) {
                    return new NextResponse("No metadata", { status: 400 });
                }

                const { name, email, guests, activities, phone, dateTime, type } = metadata;

                if (type === "reservation") {
                    const special_requests = session.custom_fields?.find(
                        field => field.key === "special_request"
                    )?.text?.value || null;


                    await supabase.from("reservations").insert({
                        name,
                        email,
                        datetime: dateTime,
                        guest: Number(guests),
                        activities: activities.split(",").map(a => a.trim()),
                        phone,
                        stripe_session_id: session.id,
                        special_requests
                    });

                    console.log("✅ Reservation created for:", name);
                    break;
                }

                if (type === "shop_purchase") {
                    // retrieve line items to sync stock
                    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

                    for (const item of lineItems.data) {
                        const productId = item.price?.metadata?.product_id;
                        const quantity = item.quantity ?? 0;

                        if (!productId) {
                            console.warn("⚠️ Missing product_id on line item:", item.id);
                            continue; // skip but at least log it
                        }

                        // decrement stock in supabase
                        await supabase.rpc("decrement_stock", {
                            p_product_id: Number(productId),
                            p_quantity: quantity,
                        });
                    }

                    console.log("✅ Stock synced for shop purchase");
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