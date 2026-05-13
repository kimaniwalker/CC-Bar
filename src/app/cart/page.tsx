import ProfileOverviewPage from "@/components/client/Profile/ProfileOverview";
import ServerProducts from "@/components/server/ServerProducts";
import { Suspense } from "react";


export default function Page() {
  return  (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-lg text-neutral-500">Loading profile...</p></div>}>
    <ProfileOverviewPage  />
    </Suspense>
  )
}
