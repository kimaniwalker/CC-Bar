import Stripe from 'stripe'
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!)


export default function useStripe() {
    return { createAccountLink, affiliateLoginLink, stripeBillingPortal, getAcctData, getCustomerData, hasActiveSubscription, isAffiliateReady, checkout }
}
export function isAffiliateReady(account: Stripe.Account) {
    const accountReady = account.charges_enabled && account.payouts_enabled
    if (accountReady) return true
    else return false
}

export function hasActiveSubscription(customer: Stripe.Customer) {
    const subscription = customer.subscriptions?.data[0]

    if (subscription?.status === 'active') return true
    else return false
}
export async function affiliateLoginLink(account_id: string) {
    const loginLink: Stripe.LoginLink = await stripe.accounts.createLoginLink(
        account_id
    );
    console.log({ loginLink })
    return loginLink
}

export async function stripeBillingPortal(customer_id: string) {
    const session: Stripe.BillingPortal.Session = await stripe.billingPortal.sessions.create({
        customer: customer_id,
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN}auth/login`,
    });
    console.log({ session })

    return session
}
export async function createAccountLink(account_id: string) {
    const accountLink: Stripe.AccountLink = await stripe.accountLinks.create({
        account: account_id,
        refresh_url: `${process.env.NEXT_PUBLIC_DOMAIN}auth/login?affiliate_refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN}auth/login`,
        type: 'account_onboarding',
    });
    console.log({ accountLink })
    return accountLink
}

export async function getAcctData(account_id: string) {
    const account: Stripe.Account = await stripe.accounts.retrieve(
        account_id
    );

    return account
}
export async function getCustomerData(customer_id: string) {
    const customer: Stripe.Customer | Stripe.DeletedCustomer = await stripe.customers.retrieve(
        customer_id, { expand: ['subscriptions'] }
    );

    if (customer.deleted) {
        return
    }
    return customer
}

export async function checkout(body: Stripe.Checkout.SessionCreateParams) {

    const session = await stripe.checkout.sessions.create(body);

    return session
}

export async function createNewUser(id: string, email?: string, phone?: string) {

    let customerParams: Stripe.CustomerCreateParams = {
        description: id,
        metadata: { id }
    }
    let accountParams: Stripe.AccountCreateParams = {
        type: 'express',
        business_type: 'individual',
        individual: {
        }
    }
    if (email) {
        customerParams['email'] = email
    }
    if (phone) {
        customerParams["phone"] = phone
    }
    if (accountParams.individual && email) {
        accountParams.individual["email"] = email
    }
    if (accountParams.individual && phone) {
        accountParams.individual["phone"] = phone
    }
    const customer = await stripe.customers.create(customerParams);
    const account = await stripe.accounts.create(accountParams);

    return { customer, account }
}

export async function retreiveCheckoutSession(sessionId: string) {

    const session = await stripe.checkout.sessions.retrieve(
        sessionId
    );


    const lineItems = await stripe.checkout.sessions.listLineItems(
        sessionId
    );

    return { session, lineItems }
}