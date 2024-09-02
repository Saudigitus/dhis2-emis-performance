import { atom } from "recoil"

interface UpdatingEventType {
    loading: boolean
    event: string
}


export const UpdatingEventState = atom<UpdatingEventType>({
    key: "update-event-state",
    default: { loading: false, event: '' }
})
