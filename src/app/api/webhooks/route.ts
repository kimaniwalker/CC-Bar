import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/Supabase/server";
import { retreiveCheckoutSession } from "@/hooks/useStripe";
import { CheckoutType } from "@/types/Reservations";

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

                if (type === CheckoutType.SHOP) {
                    const { lineItems } = await retreiveCheckoutSession(session.id);
                
                    // 👇 collect all updates first
                    const stockUpdates = lineItems.reduce((acc, item) => {
                        const product = item.price?.product as Stripe.Product;
                        const { product_id, sku, isVariationProduct } = product?.metadata || {};
                
                        if (!product_id) {
                            console.warn("⚠️ Missing product_id on line item:", item.id);
                            return acc;
                        }
                
                        acc.push({
                            product_id,
                            sku,
                            quantity: item.quantity ?? 0,
                            is_variation: isVariationProduct === "true",
                        });
                
                        return acc;
                    }, [] as { product_id: string; sku: string; quantity: number; is_variation: boolean }[]);
                    console.log("stockUpdates:", JSON.stringify(stockUpdates, null, 2)); 
                
                    // 👇 one RPC call for all updates
                    const { error } = await supabase.rpc("sync_stock", { updates: stockUpdates });
                
                    if (error) {
                        console.error("❌ Failed to sync stock:", error.message);
                        return new NextResponse("Stock sync failed", { status: 500 });
                    }
                
                    console.log(`✅ Stock synced for ${stockUpdates.length} items`);
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