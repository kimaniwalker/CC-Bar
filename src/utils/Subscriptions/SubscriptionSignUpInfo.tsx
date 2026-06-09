"use client";

import { Text } from "@/components/ds/Text";

export const SubscriptionSignupInfo = () => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const nextMonth = new Date(now.setMonth(now.getMonth() + 1)).toLocaleString(
    "default",
    { month: "long" },
  );

  const willGetCurrentBox = currentDay < 5;

  return (
    <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-6">
      <Text size="md" className="text-lg font-semibold text-blue-900 mb-3">
        📦 How It Works
      </Text>

      <div className="space-y-3 text-sm text-blue-800">
        {willGetCurrentBox ? (
          <>
            <Text size="sm" className="flex items-start gap-2">
              <span className="text-lg">✨</span>
              <span>
                <strong>
                  You&apos;ll receive {currentMonth}&apos;s surprise box!
                </strong>{" "}
                Orders placed before the 5th ship with the current month&apos;s
                box.
              </span>
            </Text>
            <Text size="sm" className="flex items-start gap-2">
              <span className="text-lg">📅</span>
              <span>
                Your next billing date will be{" "}
                <strong>{currentMonth} 5th</strong> for ${nextMonth}&apos;s box.
              </span>
            </Text>
          </>
        ) : (
          <>
            <Text size="sm" className="flex items-start gap-2">
              <span className="text-lg">⏰</span>
              <span>
                <strong>
                  You&apos;ll receive {nextMonth}&apos;s surprise box!
                </strong>{" "}
                The cutoff for {currentMonth}&apos;s box was the 5th.
              </span>
            </Text>
            <Text size="sm" className="flex items-start gap-2">
              <span className="text-lg">📅</span>
              <span>
                Your next billing date will be <strong>{nextMonth} 5th</strong>{" "}
                for the following month&apos;s box.
              </span>
            </Text>
          </>
        )}

        <Text size="sm" className="flex items-start gap-2">
          <span className="text-lg">🔄</span>
          <span>
            All subscriptions renew on the <strong>5th of each month</strong> at
            $25.
          </span>
        </Text>

        <Text size="sm" className="flex items-start gap-2">
          <span className="text-lg">⏸️</span>
          <span>Skip a month anytime before the 5th if you need a break!</span>
        </Text>
      </div>
    </div>
  );
};
