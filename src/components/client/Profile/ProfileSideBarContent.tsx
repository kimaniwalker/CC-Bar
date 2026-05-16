"use client"

import { Text } from "@/components/ds/Text"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const ProfileSideBarContent = ({ mfaContent }: { mfaContent: React.ReactNode }) => {
    const navItems = [
        { key: "overview", label: 'Overview' },
        { key: "orders", label: 'Orders' },
        { key: "favorites", label: 'Favorites' },
        { key: "profile", label: 'Profile' },
    ]

    const router = useRouter()
    const params = useSearchParams()
    const pathname = usePathname()
    const section = params.get("section") ?? "overview"

    return (<aside className="hidden min-h-screen w-72 border-r border-neutral-200 bg-white p-6 md:block">
        <div>
            <Text size="lg" className="font-semibold tracking-tight text-3xl md:text-4xl">
                My Account
            </Text>

            <Text size="sm" className="mt-2 text-sm leading-6 text-neutral-500">
                View orders, manage favorites, and update your profile.
            </Text>
        </div>

        <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
                const isActive = section === item.key
                return (
                    <button
                        key={item.key}
                        onClick={() => router.push(`${pathname}?section=${item.key}`)}
                        className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Text size="sm" as="span" className="text-md md:text-lg">{item.label}</Text>
                    </button>
                )
            })}
        </nav>
        {mfaContent}

    </aside>
    )
}