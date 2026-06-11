import { redirect } from "next/navigation";
import { getUser } from "@/utils/User/getUser";
import { getUserSubscription } from "@/utils/Subscriptions/getUserSubscription";
import CheckoutContent from "@/components/client/Checkout/CheckoutContent";
import { Suspense } from "react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { flow } = await searchParams;

  // Only check if user is trying to access VIP subscription flow
  if (flow === "isVipSubscription") {
    const user = await getUser();

    if (user?.id) {
      const subscriptions = await getUserSubscription(user.id);

      if (subscriptions && subscriptions.length > 0) {
        redirect("/profile/overview?error=already_has_subscription");
      }
    }
  }

  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
