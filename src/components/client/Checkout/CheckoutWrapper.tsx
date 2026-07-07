import CheckoutContent from "./CheckoutContent";
import { getUser } from "@/utils/User/getUser";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";

export default async function CheckoutWrapper() {
  const user = await getUser();
  // Fetch subscription data
  const subscriptions = user ? await getUserSubscription(user.id) : null;
  const subscription = subscriptions ? subscriptions[0] : null;

  return <CheckoutContent user={user} subscription={subscription} />;
}
