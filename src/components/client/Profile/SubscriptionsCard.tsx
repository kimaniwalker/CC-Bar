import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import { SubscriptionSignup } from "./SubscriptionSignup";
import { SubscriptionDetails } from "./SubscriptionDetails";
import { getUser } from "@/utils/User/getUser";

export const SubscriptionCard = async () => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const subscriptions = await getUserSubscription(user.id);
  const subscription = subscriptions ? subscriptions[0] : null;

  // No subscription - Show sign up
  if (!subscription) {
    return <SubscriptionSignup user={user} />;
  }

  return <SubscriptionDetails subscription={subscription} user={user} />;
};
