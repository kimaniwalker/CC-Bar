import {
  CheckoutEvent,
  ElementClickedEvent,
  ElementViewedEvent,
} from "@/types/Analytics";
import { sendAnalyticsEvent } from "./sendAnalyticsEvent";

export const analytics = {
  trackElementClicked: (data: ElementClickedEvent) => {
    sendAnalyticsEvent(data);
    console.log("Element clicked:", data);
  },
  trackElementViewed: (data: ElementViewedEvent) => {
    sendAnalyticsEvent(data);
    console.log("Element viewed", data);
  },
  trackCheckoutStarted: (data: CheckoutEvent) => {
    sendAnalyticsEvent(data);
    console.log("Checkout started");
  },
  trackCheckoutCompleted: () => {
    sendAnalyticsEvent({ event: "checkout_completed" });
    console.log("Checkout completed");
  },
};
