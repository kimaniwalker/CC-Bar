import { Suspense } from "react"
import { Favorites } from "./Favorites"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileMobileTabs } from "./ProfileMobileTabs"
import { ProfileSideBar } from "./ProfileSideBar"
import Orders from "./Orders"
import { PROFILE_SECTIONS } from "@/types/User"
import ProfileOverviewSkeleton from "./ProfileOverviewSkeleton"

export default function ProfileOverviewPage({ section }: { section?: string }) {
  console.log({ section })

  return (
    <Suspense fallback={<ProfileOverviewSkeleton />}>


      <div className="min-h-screen bg-gray-100 text-neutral-900">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
          {/* Mobile Tabs */}
          <ProfileMobileTabs />

          {/* Sidebar */}
          <ProfileSideBar />

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8">
            {/* Header */}
            <ProfileHeader />

            {/* Content Grid */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              {(section === PROFILE_SECTIONS.OVERVIEW || section === undefined) && (
                <>
                  {/* Orders */}
                  <Orders />
                  {/* Favorites */}
                  <Favorites />
                </>
              )}
              {section === PROFILE_SECTIONS.ORDERS && <Orders />}
              {section === PROFILE_SECTIONS.FAVORITES && <Favorites />}
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  )
}
