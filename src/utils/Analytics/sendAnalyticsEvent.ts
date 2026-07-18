import { sendGTMEvent } from "@next/third-parties/google";
import { GTMEvent } from "@/types/Analytics";

export function sendAnalyticsEvent(event: GTMEvent) {
  const enrichedEvent = {
    ...event,
  };

  sendGTMEvent(enrichedEvent);
}
