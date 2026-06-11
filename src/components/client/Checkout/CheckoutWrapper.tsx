import CheckoutContent from "./CheckoutContent";
import { getUser } from "@/utils/User/getUser";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { redirect } from "next/navigation";

export default async function CheckoutWrapper({ flow }: { flow?: string }) {
  const user = await getUser();
  // Fetch subscription data
  const subscriptions = user ? await getUserSubscription(user.id) : null;
  const subscription = subscriptions ? subscriptions[0] : null;

  if (flow === "isVipSubscriptionFlow" && subscription) {
    redirect("/profile/overview?error=already-subscribed");
  }

  return <CheckoutContent user={user} subscription={subscription} />;
}
