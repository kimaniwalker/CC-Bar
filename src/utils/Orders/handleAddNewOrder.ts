"use server"
import { createClient } from "@/utils/supabase/client"
import { Order } from "@/types/Orders";
import Stripe from "stripe";

type OrderInsert = Omit<Order, "created_at" | "updated_at" | "items"> & {
    lineItems: Stripe.LineItem[]
}

export const handleAddNewOrder = async ({
    order,
}: {
    order: OrderInsert
}) => {
    const supabase = createClient()

    // insert the order and return the new id
    const { data: insertedOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: order.user_id,
            stripe_payment_intent_id: order.stripe_payment_intent_id,
            stripe_customer_id: order.stripe_customer_id,
            total: order.total,
            subtotal: order.subtotal,
            shipping_total: order.shipping_total,
            status: order.status,
        })
        .select("id")
        .single()

    if (orderError) {
        return { success: false, error: orderError.message }
    }

    console.log('order created')

    const orderId = insertedOrder.id

    // attach order_id to each order item before inserting
    const itemsToInsert = order.lineItems.map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
            order_id: orderId,
            product_id: product.metadata?.product_id || null,
            sku: product.metadata?.sku || null,
            quantity: item.quantity,
            price: item.price?.unit_amount || 0,
        }

    })

    const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert)

    if (orderItemsError) {
        return { success: false, error: orderItemsError.message }
    }

    console.log('order items created')

    return { success: true, orderId }
}