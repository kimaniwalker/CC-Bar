import { Text } from "@/components/ds/Text";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <Text size="lg" className="font-semibold md:text-2xl">
          Privacy Policy
        </Text>

        <Text size="sm">
          Candle Cow Bar respects your privacy and is committed to protecting
          the personal information you provide. This Privacy Policy explains
          what information we collect, how we use it, and the choices available
          to you.
        </Text>

        <Text size="sm">Last Updated: July 2026</Text>
      </div>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Information We Collect
        </Text>

        <Text size="sm">
          We collect only the information necessary to provide our products,
          services, and customer experience.
        </Text>

        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-700">
          <Text as="li" size="sm">
            Name (if provided)
          </Text>

          <Text as="li" size="sm">
            Email address
          </Text>

          <Text as="li" size="sm">
            Mobile phone number (when voluntarily provided)
          </Text>

          <Text as="li" size="sm">
            Reservation and order information
          </Text>

          <Text as="li" size="sm">
            Account preferences and loyalty information
          </Text>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          How We Use Your Information
        </Text>

        <Text size="sm">
          We use your information to operate and improve Candle Cow Bar,
          including to:
        </Text>

        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-700">
          <Text as="li" size="sm">
            Create and manage your account
          </Text>

          <Text as="li" size="sm">
            Authenticate your identity and provide secure account access
          </Text>

          <Text as="li" size="sm">
            Process reservations and purchases
          </Text>

          <Text as="li" size="sm">
            Send order confirmations, reservation confirmations, reminders, and
            other account-related notifications
          </Text>

          <Text as="li" size="sm">
            Respond to customer service requests
          </Text>

          <Text as="li" size="sm">
            Improve our products, services, and website
          </Text>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          SMS Communications
        </Text>

        <Text size="sm">
          If you voluntarily provide your mobile phone number and explicitly
          consent to receive SMS messages, we may send transactional text
          messages related to your account and services.
        </Text>

        <Text size="sm">These messages may include:</Text>

        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-700">
          <Text as="li" size="sm">
            One-time verification codes
          </Text>

          <Text as="li" size="sm">
            Reservation confirmations and reminders
          </Text>

          <Text as="li" size="sm">
            Order confirmations and order status updates
          </Text>

          <Text as="li" size="sm">
            Customer support communications
          </Text>
        </ul>

        <Text size="sm">
          Promotional SMS messages will only be sent to users who separately opt
          in to receive marketing communications.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Sharing Your Information
        </Text>

        <Text size="sm">
          We do not sell, rent, or trade your personal information.
        </Text>

        <Text size="sm">
          We may share information with trusted service providers that help us
          operate our business, including payment processing, authentication,
          messaging delivery, shipping, analytics, and website hosting.
        </Text>

        <Text size="sm" className="font-medium">
          Mobile phone numbers and SMS consent are not shared with third parties
          or affiliates for marketing or promotional purposes.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Data Security
        </Text>

        <Text size="sm">
          We implement reasonable administrative, technical, and physical
          safeguards to help protect your personal information from unauthorized
          access, disclosure, alteration, or destruction.
        </Text>

        <Text size="sm">
          While we strive to protect your information, no method of electronic
          storage or internet transmission is completely secure.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Cookies & Analytics
        </Text>

        <Text size="sm">
          We use cookies and analytics tools to improve website performance,
          understand how visitors use our website, and enhance your overall
          experience.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Your Choices
        </Text>

        <Text size="sm">
          You may update your account information at any time through your
          account settings.
        </Text>

        <Text size="sm">
          You may opt out of promotional emails using the unsubscribe link
          included in those messages.
        </Text>

        <Text size="sm">
          If you have opted in to SMS communications, you may stop receiving SMS
          messages by replying <strong>STOP</strong>. Reply{" "}
          <strong>HELP</strong> for assistance.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Changes to This Policy
        </Text>

        <Text size="sm">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Contact Us
        </Text>

        <Text size="sm">
          If you have questions regarding this Privacy Policy or how your
          information is handled, please contact Candle Cow Bar through our
          website.
        </Text>
      </section>
    </div>
  );
}
