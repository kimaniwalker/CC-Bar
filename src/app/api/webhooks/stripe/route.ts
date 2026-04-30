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
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const special_requests = session.custom_fields?.find(field => field.key === "special_request")?.text?.value || null;
                const metadata = session.metadata;

                console.log("✅ checkout.session.completed", { metadata });

                if (!metadata) {
                    return new NextResponse("No metadata", { status: 400 });
                }

                const { name, email, date, time, guests, activities, phone, dateTime } = metadata;

                console.log("Creating reservation for:", { name, email, date, time, guests, activities, dateTime });

                await supabase.from("reservations").insert({
                    name,
                    email,
                    datetime: dateTime,
                    guest: Number(guests),
                    activities: activities.split(",").map(a => a.trim()), // ✅ string[]
                    phone,
                    stripe_session_id: session.id,
                    special_requests
                });

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