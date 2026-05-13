"use client"
import { Order } from "@/types/Orders"
import { useRouter } from "next/navigation"

export const OrdersContent = ({recentOrders}:{recentOrders:Order[]}) => {
    const router = useRouter()
    const handleViewOrderDetails = (orderId: string) => {
        // Navigate to the order details page (you can customize the route as needed)
        router.push("/profile/orders/" + orderId)
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
          <h3 className="text-xl font-semibold">Recent Orders</h3>
          <p className="mt-1 text-sm text-neutral-500">
            View recent purchases and shipment updates.
          </p>
        </div>

        <button className="text-sm font-medium text-neutral-900 hover:underline">
          View All
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium text-neutral-900">
                Order - {order.id.substring(0,4)}...{order.id.substring(order.id.length - 4)}
              </p>

              <div className="mt-2 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {order.status}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-neutral-600">
                {convertToCurrency(order.total)}
              </p>

              <button onClick={() => handleViewOrderDetails(order.id)} className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100">
                View Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
    
}