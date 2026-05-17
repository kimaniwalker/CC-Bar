"use client"

import { createClient } from "@/utils/Supabase/client"
import { useRouter } from "next/navigation"

export const Logout = () => {
    const supabase = createClient()
    const router = useRouter()

    return (
        <button
            onClick={async () => {
                await supabase.auth.signOut()
                router.push("/auth/login")
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
            Logout
        </button>
    )
}       