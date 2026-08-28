import { RESERVATION_THEMES } from "./ThemeMetadata";
import DateNightLanding from "./DateNightLanding";
import KidsNightLanding from "./KidsNightLanding";
import { LandingPageForm } from "./LandingPageForm";

type Props = {
  params: Promise<{ theme: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ReservationsContainer({
  params,
  searchParams,
}: Props) {
  const { theme } = await params;
  const search = await searchParams;

  const trackingData = {
    utm_source: getParam(search, "utm_source"),
    utm_medium: getParam(search, "utm_medium"),
    utm_campaign: getParam(search, "utm_campaign"),
    utm_content: getParam(search, "utm_content"),
    gclid: getParam(search, "gclid"),
    fbclid: getParam(search, "fbclid"),
  };

  // ✅ Show specialized landing page for date-night, default form for everything else
  switch (theme) {
    case RESERVATION_THEMES.DATE_NIGHT:
      return <DateNightLanding trackingData={trackingData} />;

    case RESERVATION_THEMES.KIDS_NIGHT:
      return <KidsNightLanding trackingData={trackingData} />;

    default:
      // Handles all other themes (valid or invalid) with standard form
      return <LandingPageForm theme={theme} trackingData={trackingData} />;
  }
}
