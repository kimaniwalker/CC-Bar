import { Text } from "@/components/ds/Text";

export default function TermsAndPrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <Text size="lg" className="font-semibold md:text-2xl">
          Terms & Conditions / Privacy Policy
        </Text>

        <Text size="sm">
          By using our website, creating an account, placing an order, or
          signing up for communications, you agree to the following terms and
          privacy practices.
        </Text>
      </div>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Information We Collect
        </Text>

        <Text size="sm">
          We only collect and store limited user information necessary to
          provide and improve our services.
        </Text>

        <Text size="sm">The information we may collect includes:</Text>

        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-700">
          <Text as="li" size="sm">
            Email address
          </Text>
          <Text as="li" size="sm">
            Phone number (if voluntarily provided)
          </Text>
        </ul>

        <Text size="sm">
          We do not intentionally collect unnecessary personal information.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          How We Use Your Information
        </Text>

        <Text size="sm">
          Your information is used strictly for business and customer experience
          purposes, including:
        </Text>

        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-700">
          <Text as="li" size="sm">
            Simplifying and securing the login process
          </Text>
          <Text as="li" size="sm">
            Providing order updates and tracking notifications
          </Text>
          <Text as="li" size="sm">
            Communicating important account or order information
          </Text>
          <Text as="li" size="sm">
            Sending promotional offers, discounts, new product releases, and
            marketing updates
          </Text>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Marketing Communications
        </Text>

        <Text size="sm">
          By creating an account or providing your contact information, you
          agree to receive marketing and promotional communications from us.
        </Text>

        <Text size="sm">These communications may include:</Text>

        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-700">
          <Text as="li" size="sm">
            Exclusive discounts and offers
          </Text>
          <Text as="li" size="sm">
            Product launches and restocks
          </Text>
          <Text as="li" size="sm">
            Event announcements and candle class updates
          </Text>
          <Text as="li" size="sm">
            Rewards and loyalty program information
          </Text>
        </ul>

        <Text size="sm">
          Users may opt out of promotional messages at any time by following the
          unsubscribe instructions included in emails or by replying “STOP” to
          SMS marketing messages.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Data Protection
        </Text>

        <Text size="sm">
          We take reasonable measures to protect your information from
          unauthorized access, misuse, or disclosure.
        </Text>

        <Text size="sm">
          While we strive to use commercially acceptable methods to protect your
          data, no method of electronic storage or transmission over the
          internet is completely secure.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Third-Party Services
        </Text>

        <Text size="sm">
          We may use trusted third-party providers for services such as payment
          processing, authentication, shipping, analytics, and communication
          delivery.
        </Text>

        <Text size="sm">
          These providers only receive information necessary to perform their
          services and are expected to handle user data responsibly.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Cookies & Analytics
        </Text>

        <Text size="sm">
          Our website may use cookies or analytics tools to improve website
          functionality, monitor performance, and enhance the customer
          experience.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          User Responsibilities
        </Text>

        <Text size="sm">
          Users agree not to misuse the website, interfere with platform
          functionality, attempt unauthorized access, or engage in fraudulent
          activity.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Policy Updates
        </Text>

        <Text size="sm">
          We reserve the right to update or modify these Terms & Conditions and
          Privacy Policy at any time. Changes become effective immediately upon
          being posted to this page.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text size="md" className="font-semibold">
          Contact
        </Text>

        <Text size="sm">
          If you have questions regarding these terms or privacy practices,
          please contact us directly through our website or support channels.
        </Text>
      </section>
    </div>
  );
}
