"use client"
import { Input } from "@/components/ds/Input"
import { Text } from "@/components/ds/Text"
import { createClient } from "@/utils/supabase/client"
import React from "react"

export const MFAModal = () => {

    const [phone, setPhone] = React.useState("")
    const supabase = createClient()

    const handleAccountSignIn = async () => {
        await
            supabase.auth.signInWithOtp({
                phone:
                    "+12056038724"
                // usually false if you’re linking to an existing logged-in user
            });
    }

    const handleVerifyOTP = async () => {
        await
            supabase.auth.verifyOtp({
                phone: "2056038724",
                token: "123456",
                type: "sms",
            });
    }

    const handleLinkPhoneNumber = async () => {
        const { data, error } = await supabase.auth.linkIdentity({
            provider: "phone",
            token: ""
        });
    }

    return (<div className="rounded-3xl border border-neutral-200 bg-[#F8F5F1] p-5 relative flex flex-col items-start">

        <Text className="text-sm font-medium text-neutral-900">
            Enable phone sign in
        </Text>

        <Text size="sm" className="mt-2 text-sm leading-6 text-neutral-500">
            Rewards await! Add your phone number for faster sign in and order updates.
        </Text>

        <Input value={phone} onChange={(e) => setPhone(e.target.value)} hideLabel name="phone" type="tel" placeholder="Enter your phone number" className="my-4 w-full py-2 border-2 border-black rounded-full px-2 text-black font-semibold shadow-2xl" />

        <button onClick={handleAccountSignIn} className="mt-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            <span className="text-sm">Continue</span>
        </button>
    </div>)
}   