import { Text } from "@/components/ds/Text";

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <Text size="lg" className="font-semibold md:text-2xl">
          Terms & Conditions
        </Text>

        <Text>Last updated: July 10, 2026</Text>
      </div>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          1. Acceptance of Terms
        </Text>
        <Text>
          By accessing or using Candle Cow Bar’s website, products, services,
          and experiences, you agree to be bound by these Terms & Conditions. If
          you do not agree with these terms, please do not use our services.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          2. Products & Services
        </Text>
        <Text>
          Candle Cow Bar offers handcrafted candles, personal care products,
          fragrances, home goods, and custom experiences. Because our products
          are handmade, slight variations in color, scent, texture, and
          appearance may occur. These variations are natural and are not
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
          otherwise stated.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          5. Reservations & Experiences
        </Text>
        <Text>
          Reservations for Candle Cow Bar experiences require accurate customer
          information and payment of any required deposits. Deposits may be
          non-refundable depending on the cancellation policy associated with
          the reservation.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          6. Returns & Exchanges
        </Text>
        <Text>
          Due to the handmade nature of our products, returns and exchanges may
          be limited. If you receive a damaged or incorrect item, please contact
          us within a reasonable timeframe so we can review and assist with your
          request.
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
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          8. Intellectual Property
        </Text>
        <Text>
          All content on this website, including logos, branding, images,
          product descriptions, and designs, belongs to Candle Cow Bar and may
          not be copied, reproduced, or used without permission.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          9. Limitation of Liability
        </Text>
        <Text>
          Candle Cow Bar is not responsible for damages resulting from misuse of
          products, failure to follow safety instructions, or circumstances
          outside of our reasonable control.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          10. Changes to These Terms
        </Text>
        <Text>
          We reserve the right to update these Terms & Conditions at any time.
          Changes will be posted on this page with an updated revision date.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          11. Contact Us
        </Text>
        <Text>
          If you have questions regarding these Terms & Conditions, please
          contact Candle Cow Bar through the contact information provided on our
          website.
        </Text>
      </section>
    </div>
  );
}
