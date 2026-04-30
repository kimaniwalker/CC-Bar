"use client"
import { Cart } from '@/types/Cart'
import { ReservationsFormInputs } from '@/types/Reservations'
import { User } from '@/types/User'
import { round } from 'lodash'
import { form } from 'motion/react-client'

import Stripe from 'stripe'

export default function useHandlePayment() {
    return { formatMetadata, calculateTotal, formatBody, formatReservationsData }
}

function formatMetadata(cart: Cart) {
    let metaData: Record<string, string> = {}
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i]
        metaData[item.name] = `${item.size} - x ${item.quantity}`
        metaData[`${item.name}-Custom message`] = `${item.custom_messsage}`
    }


    return metaData
}

function formatReservationsMetadata(data: ReservationsFormInputs) {
    let metaData: Record<string, string> = {}
    metaData['type'] = 'CC BAR Creative Experience Reservation'
    metaData['name'] = data.name
    metaData['email'] = data.email
    metaData['phone'] = data.phone
    metaData['date'] = data.date
    metaData['dateTime'] = data.dateTime
    metaData['time'] = data.time
    metaData['guests'] = data.guests.toString()
    metaData['activities'] = data.activities.join(', ')
    if (data.special_requests) {
        metaData['special requests'] = data.special_requests
    }

    return metaData
}
function formatLineItems(cart: Cart) {
    let lineItems = []
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i]
        let body = {
            price_data: {
                currency: 'usd',
                unit_amount: Math.round(item.price * 100),
                product_data: {
                    name: item.name,
                    description: item.size,
                    images: [`${item.thumbnail}`]
                },
            },
            quantity: item.quantity,
        }

        lineItems.push(body)
    }
    console.log(lineItems)
    return lineItems
}

function calculateTotal(cart: Cart) {
    let total = 0;

    if (cart.length >= 1) {
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const price = item.price;
            const quantity = item.quantity;

            total += price * quantity;
        }
    }

    return round(total, 2);
}

function formatBody(cart: Cart, shipping_total: number, redirect_url: string, user?: User | null, ) {
    const metadata = formatMetadata(cart)
    const line_items = formatLineItems(cart)
    let body: Stripe.Checkout.SessionCreateParams = {
        line_items,
        mode: "payment",
        client_reference_id: user?.id,
        metadata,
        submit_type: "pay",
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
        allow_promotion_codes: true,
        payment_method_types: ['card', 'cashapp', 'klarna', 'link', 'afterpay_clearpay',],
        phone_number_collection: {
            enabled: true,
        },
        consent_collection: {
            terms_of_service: 'none'
        },
        shipping_address_collection: {
            allowed_countries: ['US']
        },
        shipping_options: [{
            shipping_rate_data: {
                display_name: 'Candlelicious Priority Shipping',
                type: "fixed_amount",
                delivery_estimate: {
                    maximum: {
                        unit: "week",
                        value: 2
                    },
                },
                fixed_amount: {
                    amount: shipping_total,
                    currency: "usd"
                },
            }
        }],
        custom_fields: [{
            key: 'special_request',
            label: {
                custom: 'Special Request',
                type: 'custom'
            },
            type: 'text',
            optional: true,
        }]
    }
    if (user?.customer_id) {
        body['customer'] = user.customer_id
    }
    return body
}
function formatReservationsLineItems(data: ReservationsFormInputs) {
    let lineItems = []
        let body = {
            price_data: {
                currency: 'usd',
                unit_amount: 2500,
                product_data: {
                    name: 'CC BAR Creative Experience',
                    description: `Date: ${data.date} Time: ${data.time} Guests: ${data.guests}`,
                    
                },
            },
            quantity: data.guests,
        }

        lineItems.push(body)
    
    console.log(lineItems)
    return lineItems
}

function formatReservationsData({redirect_url, ReservationsFormData}:{redirect_url: string, ReservationsFormData: ReservationsFormInputs}) {
    const metadata = formatReservationsMetadata(ReservationsFormData)
    const line_items = formatReservationsLineItems(ReservationsFormData)
    let body: Stripe.Checkout.SessionCreateParams = {
        line_items,
        mode: "payment",
        metadata,
        submit_type: "pay",
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}success/?session_id={CHECKOUT_SESSION_ID}&type=reservation`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}${redirect_url}`,
        allow_promotion_codes: true,
        payment_method_types: ['card', 'cashapp', 'klarna', 'link', 'afterpay_clearpay',],
        phone_number_collection: {
            enabled: true,
        },
        consent_collection: {
            terms_of_service: 'none'
        },
        custom_fields: [{
            key: 'special_request',
            label: {
                custom: 'Special Request',
                type: 'custom'
            },
            type: 'text',
            optional: true,
        }]
    }

    return body
}

