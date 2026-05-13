"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const ProfileSideBar = () => {
  const navItems = [
            { key: "overview", label: 'Overview' },
            { key: "orders", label: 'Orders' },
            { key: "favorites", label: 'Favorites' },
            { key: "profile", label: 'Profile' },
       ]

    const router = useRouter()
    const params  = useSearchParams()
    const pathname = usePathname()
    const section = params.get("section") ?? "overview" 

    return (<aside className="hidden min-h-screen w-72 border-r border-neutral-200 bg-white p-6 md:block">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My Account
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            View orders, manage favorites, and update your profile.
          </p>
        </div>

        <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
            const isActive = section === item.key
            return (
              <button
                key={item.key}
                onClick={() => router.push(`${pathname}?section=${item.key}`)}
                className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-12 rounded-3xl border border-neutral-200 bg-[#F8F5F1] p-5">
          <p className="text-sm font-medium text-neutral-900">
            Enable phone sign in
          </p>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Add your phone number for faster sign in and order updates.
          </p>

          <button className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Add Phone Number
          </button>
        </div>
      </aside>
)}