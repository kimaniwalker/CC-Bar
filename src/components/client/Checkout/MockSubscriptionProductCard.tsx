import { Text } from "@/components/ds/Text";
import { Crown, Sparkles, Check, Package } from "lucide-react";

export const MockSubscriptionProductCard = () => {
  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 p-6 shadow-lg my-2">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 shadow-md">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <Text size="lg" className="font-bold text-purple-900">
              VIP Membership
            </Text>
            <Text size="sm" className="text-purple-700">
              Monthly Subscription
            </Text>
          </div>
        </div>
        <div className="rounded-full bg-purple-600 px-3 py-1">
          <Text size="xs" className="font-semibold uppercase text-white">
            Exclusive
          </Text>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4 rounded-xl bg-white/60 p-4">
        <div className="flex items-baseline gap-2">
          <Text size="xxl" className="text-3xl font-bold text-purple-900">
            $25
          </Text>
          <Text size="sm" className="text-purple-700">
            per month
          </Text>
        </div>
        <Text size="xs" className="mt-1 text-purple-600">
          Cancel anytime • Billed on the 5th of each month
        </Text>
      </div>

      {/* Description */}
      <div className="mb-4">
        <Text size="sm" className="mb-3 text-purple-900">
          Join our VIP program and unlock exclusive benefits every month!
        </Text>

        {/* Benefits */}
        <div className="space-y-2">
          <BenefitItem
            icon={<Package className="h-4 w-4" />}
            text="Monthly surprise box delivered to your door"
          />
          <BenefitItem
            icon={<Sparkles className="h-4 w-4" />}
            text="20% off all shop purchases"
          />
          <BenefitItem
            icon={<Check className="h-4 w-4" />}
            text="Free shipping on all orders"
          />
          <BenefitItem
            icon={<Crown className="h-4 w-4" />}
            text="Early access to new products & sales"
          />
        </div>
      </div>

      {/* Highlight Box */}
      <div className="mb-4 rounded-xl border-2 border-purple-300 bg-purple-100/50 p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 shrink-0 text-purple-600 mt-0.5" />
          <div>
            <Text size="sm" className="font-semibold text-purple-900 mb-1">
              What&apos;s Included This Month
            </Text>
            <Text size="xs" className="text-purple-800">
              A curated box of handmade candles, exclusive scents, and surprise
              gifts valued at $50+
            </Text>
          </div>
        </div>
      </div>

      {/* Fine Print */}
      <div className="rounded-lg bg-purple-50/50 p-3">
        <Text size="xs" className="text-purple-700 leading-relaxed">
          <strong>Note:</strong> Your VIP membership will be added to your cart.
          Complete checkout to activate your subscription and start receiving
          monthly boxes.
        </Text>
      </div>
    </div>
  );
};

// Benefit Item Component
const BenefitItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white">
        {icon}
      </div>
      <Text size="sm" className="text-purple-900">
        {text}
      </Text>
    </div>
  );
};
