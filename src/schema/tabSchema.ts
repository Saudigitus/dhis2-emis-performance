import { atom } from "recoil"
import { SelectedTabSchema } from "../types/table/SelectedTabTypes"

export const TabsState = atom<SelectedTabSchema>({
    key: "tabs-state",
    default: { name: "", value: "" }

})
