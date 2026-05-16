"use client"
import { Text } from "@/components/ds/Text"
import { Order, OrdersResponse } from "@/types/Orders"
import { useRouter } from "next/navigation"

export const OrdersContent = ({recentOrders}:{recentOrders:OrdersResponse[]}) => {
    const router = useRouter()
    const handleViewOrderDetails = (orderId: string) => {
        // Navigate to the order details page (you can customize the route as needed)
        router.push("/orders/" + orderId)
    }
    const convertToCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount / 100) // Assuming amount is in cents
      }
    return (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <Text size='lg' className="text-xl font-semibold">Recent Orders</Text>
          <Text size="sm" className="mt-1 text-sm text-neutral-500">
            View recent purchases and shipment updates.
          </Text>
        </div>

        <button className="text-sm font-medium text-neutral-900 hover:underline">
          View All
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {recentOrders.slice(0,4).map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="gap-2">
              <Text size="md" className="font-medium text-neutral-900">
                Order - {order.id.substring(0,4)}...{order.id.substring(order.id.length - 4)}
              </Text>
              <Text className="mt-2 text-xs text-neutral-600">
              {new Date(order.created_at).toLocaleDateString()}
              </Text>
              <div className="mt-4 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 uppercase">
                <Text size="xs">{order.status}</Text>
              </div>
            </div>
            

            <div className="flex items-center gap-4">
              <Text size="md" className="text-sm font-medium text-neutral-600">
                {convertToCurrency(order.total)}
              </Text>

              <button onClick={() => handleViewOrderDetails(order.id)} className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-medium transition hover:bg-neutral-100">
                <Text size="xs" as="span">View Order</Text>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
    
}