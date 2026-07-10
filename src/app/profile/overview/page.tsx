import ProfileOverviewPage from "@/components/client/Profile/ProfileOverview";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Manage your profile, view your orders, and update your account settings.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;

  return (
    <>
      <ProfileOverviewPage section={section} />
    </>
  );
}
