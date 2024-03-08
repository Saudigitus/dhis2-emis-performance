import { atom } from "recoil"
import { TermMarksConfig } from "../types/terms/TermMarksConfig"


export const TermMarksState = atom<TermMarksConfig>({
    key: "termMarks-state",
    default: {
        id: "",
        label: "",
        type: ""
    }
})

export const EventsState = atom<any[]>({
    key: "events-state",
    default: []
})
