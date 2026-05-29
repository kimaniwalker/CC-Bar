"use client";
import { Text } from "@/components/ds/Text";
import { ORDER_STATUS, OrdersResponse } from "@/types/Orders";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Calendar } from "lucide-react";

export const OrdersContent = ({
  recentOrders,
}: {
  recentOrders: OrdersResponse[];
}) => {
  const router = useRouter();

  const handleViewOrderDetails = (orderId: string) => {
    router.push("/orders/" + orderId);
  };

  const convertToCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const getStatusColor = (status: ORDER_STATUS) => {
    const statusLower = status.toLowerCase();
    if (statusLower === ORDER_STATUS.CONFIRMED.toLowerCase()) {
      return "bg-green-100 text-green-700";
    }
    if (statusLower === ORDER_STATUS.PENDING_PAYMENT.toLowerCase()) {
      return "bg-yellow-100 text-yellow-700";
    }
    if (statusLower === ORDER_STATUS.SHIPPED.toLowerCase()) {
      return "bg-blue-100 text-blue-700";
    }
    if (statusLower === ORDER_STATUS.CANCELLED.toLowerCase()) {
      return "bg-red-100 text-red-700";
    }
    return "bg-neutral-100 text-neutral-700";
  };

  if (recentOrders.length === 0) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm md:rounded-3xl md:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Package className="h-8 w-8 text-neutral-400" />
          </div>
          <Text size="lg" className="mb-2 font-semibold">
            No orders yet
          </Text>
          <Text size="sm" className="text-neutral-500">
            When you place an order, it will appear here.
          </Text>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:rounded-3xl md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-neutral-900" />
            <Text size="lg" className="font-semibold">
              Recent Orders
            </Text>
          </div>
          <Text size="sm" className="mt-1 text-neutral-500">
            View recent purchases and shipment updates.
          </Text>
        </div>

        <button className="self-start text-sm font-medium text-neutral-900 underline-offset-2 hover:underline sm:self-auto">
          View All →
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {recentOrders.slice(0, 4).map((order) => (
          <button
            key={order.id}
            onClick={() => handleViewOrderDetails(order.id)}
            className="group w-full rounded-2xl border border-neutral-200 bg-white p-4 text-left transition hover:border-neutral-300 hover:shadow-md active:scale-[0.99]"
          >
            {/* Mobile Layout */}
            <div className="flex items-start justify-between gap-3">
              {/* Left: Order Info */}
              <div className="min-w-0 flex-1">
                {/* Order Number */}
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Text
                    size="lg"
                    className="font-semibold text-neutral-900 md:text-sm"
                  >
                    #{order.id.substring(0, 8).toUpperCase()}
                  </Text>
                  <div
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs uppercase font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Date & Price */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <span>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-neutral-900">
                      <Text size="sm"> {convertToCurrency(order.total)} </Text>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Arrow */}
              <div className="flex shrink-0 items-center justify-center">
                <ChevronRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-900" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
