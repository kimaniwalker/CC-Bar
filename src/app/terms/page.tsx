import { Text } from "@/components/ds/Text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Candle Cow Bar",
  description:
    "Terms and conditions for Candle Cow Bar products, services, and SMS communications.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <Text size="lg" className="font-semibold md:text-2xl">
          Terms & Conditions
        </Text>
        <Text>Last updated: January 8, 2025</Text>
      </div>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          1. Acceptance of Terms
        </Text>
        <Text>
          By accessing or using Candle Cow Bar&apos;s website, products,
          services, and experiences, you agree to be bound by these Terms &
          Conditions. If you do not agree with these terms, please do not use
          our services.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          2. Products & Services
        </Text>
        <Text>
          Candle Cow Bar offers handcrafted candles, personal care products,
          fragrances, home goods, and custom candle-making experiences. Because
          our products are handmade, slight variations in color, scent, texture,
          and appearance may occur. These variations are natural and are not
          considered defects.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          3. Custom Products
        </Text>
        <Text>
          Custom-made products are created based on selections provided by the
          customer. Please carefully review fragrance, product options, and
          customization details before submitting your order. Custom products
          may not be eligible for cancellation or return once production has
          begun.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          4. Orders & Payments
        </Text>
        <Text>
          All orders are subject to availability and confirmation. Prices are
          displayed at the time of purchase and may change without notice.
          Payment must be received in full before orders are processed unless
          otherwise stated. We use Stripe for secure payment processing.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          5. Reservations & Experiences
        </Text>
        <Text>
          Reservations for Candle Cow Bar candle-making classes and experiences
          require accurate customer information and payment of any required
          deposits. Deposits may be non-refundable depending on the cancellation
          policy associated with the reservation. Cancellations must be made at
          least 24 hours in advance for a full refund.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          6. Returns & Exchanges
        </Text>
        <Text>
          Due to the handmade nature of our products, returns and exchanges may
          be limited. If you receive a damaged or incorrect item, please contact
          us within 7 days of delivery so we can review and assist with your
          request. Custom or personalized products cannot be returned unless
          defective.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          7. Product Safety
        </Text>
        <Text>
          Candle and fragrance products should always be used according to
          provided safety instructions. Never leave burning candles unattended,
          and keep products away from children, pets, and flammable materials.
          Always trim wicks to 1/4 inch before lighting.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          8. SMS/Text Message Communications
        </Text>
        <div className="flex flex-col gap-2">
          <Text className="font-semibold">8.1 Purpose</Text>
          <Text>
            Candle Cow Bar uses SMS/text messaging exclusively to communicate
            directly with you about:
          </Text>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <Text>Order confirmations and shipping updates</Text>
            </li>
            <li>
              <Text>Reservation confirmations and reminders</Text>
            </li>
            <li>
              <Text>
                Account access and authentication (magic link sign-in)
              </Text>
            </li>
            <li>
              <Text>VIP membership benefits and updates</Text>
            </li>
            <li>
              <Text>Customer service responses</Text>
            </li>
          </ul>

          <Text className="font-semibold mt-4">
            8.2 Explicit Consent Required
          </Text>
          <Text>
            By providing your phone number and opting in to receive text
            messages from Candle Cow Bar, you explicitly consent to receive SMS
            messages related to your account, orders, and reservations. Consent
            is not a condition of purchase unless you choose to use SMS
            authentication for account access.
          </Text>

          <Text className="font-semibold mt-4">8.3 Message Frequency</Text>
          <Text>
            You may receive up to 5 messages per month. Message frequency varies
            based on your activity (orders, reservations, account access).
            Message and data rates may apply.
          </Text>

          <Text className="font-semibold mt-4">8.4 Opt-Out Instructions</Text>
          <Text>
            You can opt out of SMS messages at any time by replying{" "}
            <span className="font-bold">STOP</span> to any message. After opting
            out, you will receive one final confirmation message. You may
            continue to receive transactional messages related to active orders
            or reservations.
          </Text>

          <Text className="font-semibold mt-4">8.5 Help & Support</Text>
          <Text>
            For help with SMS messages, reply{" "}
            <span className="font-bold">HELP</span> to any message or contact us
            at{" "}
            <a
              href="mailto:support@candlecowbar.com"
              className="underline hover:text-neutral-600"
            >
              support@candlecowbar.com
            </a>
            . For customer service, visit our website or call our store
            directly.
          </Text>

          <Text className="font-semibold mt-4">8.6 No Third-Party Sharing</Text>
          <Text>
            <span className="font-bold">
              Your phone number and consent information will NEVER be shared,
              sold, rented, or disclosed to third parties, affiliates, or
              marketing partners.
            </span>{" "}
            We do not engage in affiliate marketing, lead generation, or any
            third-party marketing activities. Your data is used solely for
            direct communication between you and Candle Cow Bar.
          </Text>

          <Text className="font-semibold mt-4">
            8.7 Privacy & Data Protection
          </Text>
          <Text>
            Your phone number is stored securely and used only as described in
            these terms. See our{" "}
            <a
              href="/privacy"
              className="underline font-semibold hover:text-neutral-600"
            >
              Privacy Policy
            </a>{" "}
            for complete details on how we handle your information.
          </Text>

          <Text className="font-semibold mt-4">8.8 Carrier Liability</Text>
          <Text>
            Candle Cow Bar and our SMS service provider are not liable for
            delayed or undelivered messages. Carriers are not liable for delayed
            or undelivered messages.
          </Text>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          9. Privacy & Data Collection
        </Text>
        <Text>
          We collect only the information necessary to provide our services
          (name, email, phone, shipping address, payment information). We use
          Supabase for secure data storage and Stripe for payment processing.{" "}
          <span className="font-bold">
            We do not sell, rent, share, or disclose your personal information
            to any third parties, affiliates, or marketing partners.
          </span>{" "}
          Your data is never used for affiliate marketing, lead generation, or
          any third-party marketing purposes.
        </Text>
        <Text>
          For complete details, please review our{" "}
          <a
            href="/privacy"
            className="underline font-semibold hover:text-neutral-600"
          >
            Privacy Policy
          </a>
          .
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          10. Intellectual Property
        </Text>
        <Text>
          All content on this website, including logos, branding, images,
          product descriptions, and designs, belongs to Candle Cow Bar and may
          not be copied, reproduced, or used without permission.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          11. Limitation of Liability
        </Text>
        <Text>
          Candle Cow Bar is not responsible for damages resulting from misuse of
          products, failure to follow safety instructions, or circumstances
          outside of our reasonable control. Our liability is limited to the
          purchase price of the product or service.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          12. Governing Law
        </Text>
        <Text>
          These Terms & Conditions are governed by the laws of the State of
          Montana, United States. Any disputes will be resolved in the
          appropriate courts of Montana.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          13. Changes to These Terms
        </Text>
        <Text>
          We reserve the right to update these Terms & Conditions at any time.
          Changes will be posted on this page with an updated revision date.
          Continued use of our services after changes constitutes acceptance of
          the updated terms.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          14. Contact Us
        </Text>
        <Text>
          If you have questions regarding these Terms & Conditions, please
          contact us:
        </Text>
        <div className="pl-4">
          <Text>Candle Cow Bar</Text>
          <Text>Email: support@candlecowbar.com</Text>
          <Text>Address: 4052 Helena, Rd</Text>
        </div>
      </section>
    </div>
  );
}
