import { atom } from "recoil"

export const ConfirmationState = atom<{ open: boolean, event: string, loading?: boolean, tei?: string }>({
    key: "confirmation-state",
    default: { open: false, event: "", loading: false }
})
