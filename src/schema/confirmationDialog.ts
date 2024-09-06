import { atom } from "recoil"

export const ConfirmationState = atom<{ open: boolean, event: string, loading?: boolean, tei?: string, loadingComplete?: boolean }>({
    key: "confirmation-state",
    default: { open: false, event: "", loading: false }
})
