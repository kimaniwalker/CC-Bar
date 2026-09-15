import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Text } from "@/components/ds/Text";

export const metadata: Metadata = {
  title: "Contact Us | Candle Cow Bar",
  description:
    "Get in touch with Candle Cow Bar. Find our address, hours, phone number, and support email.",
};

const storeHours = [
  { day: "Monday - Thursday", hours: "5:00 PM - 8:00 PM" },
  { day: "Friday", hours: "12:00 PM - 8:00 PM" },
  { day: "Saturday", hours: "12:00 AM - 8:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Text className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Contact
          </Text>
          <Text className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            We&apos;d love to hear from you
          </Text>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-100 p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <Text className="mb-2 text-lg font-semibold text-neutral-900">
                  Visit us
                </Text>
                <Text className="text-neutral-700">
                  4052 Helena Rd
                  <br />
                  Helena, AL 35080
                </Text>
              </div>

              <div className="rounded-2xl bg-neutral-100 p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <Text className="mb-2 text-lg font-semibold text-neutral-900">
                  Call us or send a text
                </Text>
                <a
                  href="tel:+12056038724"
                  className="text-neutral-700 transition hover:text-neutral-900"
                >
                  (205) 603-8724
                </a>
              </div>

              <div className="rounded-2xl bg-neutral-100 p-5 sm:col-span-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Clock3 className="h-5 w-5" />
                </div>
                <Text className="mb-4 text-lg font-semibold text-neutral-900">
                  Store hours
                </Text>
                <div className="space-y-3">
                  {storeHours.map(({ day, hours }) => (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-4 text-neutral-700"
                    >
                      <span>{day}</span>
                      <span className="font-medium">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-100 p-5 sm:col-span-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <Text className="mb-2 text-lg font-semibold text-neutral-900">
                  Support email
                </Text>
                <a
                  href="mailto:support@candlecowbar.com"
                  className="text-neutral-700 transition hover:text-neutral-900"
                >
                  support@candlecowbar.com
                </a>
              </div>
            </div>
          </section>

          <aside className="rounded-4xl bg-neutral-900 p-6 text-white shadow-sm sm:p-8">
            <Text className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-300">
              Need help?
            </Text>
            <Text className="mb-4 text-3xl font-bold">
              Let&apos;s make it easy
            </Text>
            <Text className="mb-6 text-neutral-300">
              Whether you have a question about a reservation, order, or candle
              experience, our team is here to help.
            </Text>

            <div className="space-y-4">
              <a
                href="mailto:support@candlecowbar.com"
                className="flex items-center justify-between rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                <span>Email support</span>
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="tel:+12056038724"
                className="flex items-center justify-between rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                <span>Call us</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <Link
              href="/reservations"
              className="mt-8 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
            >
              Book a class
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
