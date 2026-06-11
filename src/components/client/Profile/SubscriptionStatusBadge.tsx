import { SubscriptionStatus } from "@/types/Subscriptions";

export const SubscriptionStatusBadge = ({
  status,
  isScheduledToCancel,
  isScheduledToPause,
}: {
  status: string;
  isScheduledToCancel: boolean | null;
  isScheduledToPause: boolean | null;
}) => {
  const statusConfig = {
    [SubscriptionStatus.ACTIVE]: {
      bg: isScheduledToCancel
        ? "bg-amber-100"
        : isScheduledToPause
          ? "bg-blue-100"
          : "bg-green-100",
      text: isScheduledToCancel
        ? "text-amber-700"
        : isScheduledToPause
          ? "text-blue-700"
          : "text-green-700",
      label: isScheduledToCancel
        ? "Canceling"
        : isScheduledToPause
          ? "Pausing"
          : "Active",
    },
    [SubscriptionStatus.PAUSED]: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Paused",
    },
    [SubscriptionStatus.TRIALING]: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Trial",
    },
    [SubscriptionStatus.PAST_DUE]: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Past Due",
    },
    [SubscriptionStatus.INCOMPLETE]: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Incomplete",
    },
    [SubscriptionStatus.INCOMPLETE_EXPIRED]: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Expired",
    },
    [SubscriptionStatus.UNPAID]: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Unpaid",
    },
    [SubscriptionStatus.CANCELED]: {
      bg: "bg-neutral-100",
      text: "text-neutral-700",
      label: "Canceled",
    },
    [SubscriptionStatus.ENDED]: {
      bg: "bg-neutral-100",
      text: "text-neutral-700",
      label: "Ended",
    },
  };

  const config = statusConfig[status as SubscriptionStatus];
  if (!config) return null;

  return (
    <span
      className={`inline-flex rounded-full ${config.bg} px-2.5 py-1 text-xs font-medium ${config.text} uppercase`}
    >
      {config.label}
    </span>
  );
};
