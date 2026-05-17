"use client"
import { Text } from "@/components/ds/Text"
import { useModal } from "../ModalContext"
import { MFAModal } from "./MFAModal"

export const MFAActionButton = () => {

    const { open } = useModal()

    const handleOpenMFAModal = () => {
        open(
            <MFAModal />
        )
    }
    return (<button onClick={handleOpenMFAModal} className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
        <Text as="span" size="sm">Add phone number</Text>
    </button>)
}