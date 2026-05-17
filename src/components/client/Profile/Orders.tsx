import { getUser } from "@/utils/User/getUser"
import getUserOrders from "@/utils/Orders/getUserOrders"
import { Suspense } from "react";
import { OrdersContent } from "./OrdersContent";

export default async function Orders() {

  const user = await getUser();
  const recentOrders = await getUserOrders(user?.id)

  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <OrdersContent recentOrders={recentOrders} />
    </Suspense>
  )
}
