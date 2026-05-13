import { Suspense } from "react"
import { Favorites } from "./Favorites"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileMobileTabs } from "./ProfileMobileTabs"
import { ProfileSideBar } from "./ProfileSideBar"
import Orders from "./Orders"

export default function ProfileOverviewPage() {
   
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-lg text-neutral-500">Loading profile...</p></div>}>
        
       
      <div className="min-h-screen bg-[#F8F5F1] text-neutral-900">
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
              {/* Orders */}
             <Orders />
  
              {/* Favorites */}
              <Favorites />
            </div>
          </main>
        </div>
      </div>
        </Suspense>
    )
  }
  