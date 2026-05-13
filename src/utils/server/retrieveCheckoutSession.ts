'use server'
import Stripe from 'stripe'

export async function retreiveCheckoutSession(sessionId: string) {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "line_items.data.price.product"]  
    });
    
    return JSON.parse(JSON.stringify(session))
}