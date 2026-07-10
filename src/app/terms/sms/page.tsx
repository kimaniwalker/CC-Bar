import { Text } from "@/components/ds/Text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Terms & Conditions | Candle Cow Bar",
  description: "SMS messaging terms and conditions for Candle Cow Bar.",
};

export default function SMSTermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-4">
        <Text size="xl" className="font-bold">
          SMS Terms & Conditions
        </Text>
        <Text className="text-neutral-600">Last updated: January 10, 2025</Text>
      </div>

      <section className="flex flex-col gap-4 border-l-4 border-neutral-900 pl-6">
        <Text size="lg" className="font-semibold">
          Program Information
        </Text>
        <div className="space-y-2">
          <Text>
            <span className="font-semibold">Program Name:</span> Candle Cow Bar
            SMS Notifications
          </Text>
          <Text>
            <span className="font-semibold">Description:</span> Receive order
            updates, reservation reminders, account access, and VIP member
            benefits via text message.
          </Text>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          How It Works
        </Text>
        <Text>
          Candle Cow Bar uses SMS/text messaging to communicate directly with
          you about:
        </Text>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Text>Order confirmations and shipping updates</Text>
          </li>
          <li>
            <Text>Reservation confirmations and reminders</Text>
          </li>
          <li>
            <Text>Account access and authentication (magic link sign-in)</Text>
          </li>
          <li>
            <Text>VIP membership benefits and updates</Text>
          </li>
          <li>
            <Text>Customer service responses</Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          Consent
        </Text>
        <Text>
          By providing your phone number and opting in, you explicitly consent
          to receive SMS messages from Candle Cow Bar. Consent is not required
          to make a purchase unless you choose SMS authentication for account
          access.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          Message Frequency
        </Text>
        <Text>
          You may receive{" "}
          <span className="font-semibold">up to 5 messages per month</span>.
          Message frequency varies based on your account activity.{" "}
          <span className="font-semibold">
            Message and data rates may apply.
          </span>
        </Text>
      </section>

      <section className="flex flex-col gap-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <Text size="lg" className="font-bold">
          How to Opt Out
        </Text>
        <Text>
          To stop receiving messages, reply{" "}
          <span className="font-bold text-lg">STOP</span> to any text message.
          You will receive one final confirmation that you&apos;ve been
          unsubscribed.
        </Text>
      </section>

      <section className="flex flex-col gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <Text size="lg" className="font-bold">
          Need Help?
        </Text>
        <Text>
          Reply <span className="font-bold text-lg">HELP</span> to any message
          for assistance, or contact us at{" "}
          <a
            href="mailto:support@candlecowbar.com"
            className="underline font-semibold hover:text-blue-700"
          >
            support@candlecowbar.com
          </a>
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          Privacy & Data Protection
        </Text>
        <Text>
          <span className="font-bold">
            Your phone number and consent information will NEVER be shared,
            sold, rented, or disclosed to third parties, affiliates, or
            marketing partners.
          </span>{" "}
          We do not engage in affiliate marketing, lead generation, or any
          third-party marketing activities.
        </Text>
        <Text>
          For complete details, see our{" "}
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
          Carrier Disclaimer
        </Text>
        <Text className="text-sm text-neutral-600">
          Carriers are not liable for delayed or undelivered messages. Candle
          Cow Bar and our SMS service provider are not responsible for messages
          that fail to deliver.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text size="lg" className="font-semibold">
          Contact Us
        </Text>
        <div className="space-y-1">
          <Text>Candle Cow Bar</Text>
          <Text>
            Email:{" "}
            <a href="mailto:support@candlecowbar.com" className="underline">
              support@candlecowbar.com
            </a>
          </Text>
          <Text>Address: 4052 Helena Rd, Helena, AL</Text>
        </div>
      </section>
    </div>
  );
}
