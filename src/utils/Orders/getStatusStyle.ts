import { ORDER_STATUS } from "@/types/Orders";

type StatusStyle = {
  bg: string;
  text: string;
  icon?: string;
};

export const getStatusStyle = (status: ORDER_STATUS): StatusStyle => {
  const statusLower = status.toLowerCase();

  const statusMap: Record<string, StatusStyle> = {
    [ORDER_STATUS.CONFIRMED.toLowerCase()]: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: "✓",
    },
    [ORDER_STATUS.DELIVERED.toLowerCase()]: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: "✓✓",
    },
    [ORDER_STATUS.PENDING_PAYMENT.toLowerCase()]: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "⏳",
    },
    processing: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: "⚙️",
    },
    [ORDER_STATUS.SHIPPED.toLowerCase()]: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "📦",
    },
    [ORDER_STATUS.CANCELLED.toLowerCase()]: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: "✕",
    },
    returned: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      icon: "↩",
    },
    failed: {
      bg: "bg-red-200",
      text: "text-red-800",
      icon: "⚠",
    },
  };

  return (
    statusMap[statusLower] || {
      bg: "bg-neutral-100",
      text: "text-neutral-700",
      icon: "•",
    }
  );
};
