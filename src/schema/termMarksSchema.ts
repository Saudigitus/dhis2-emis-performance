import { atom } from "recoil"
import { TermMarksConfig } from "../types/terms/TermMarksConfig"


export const SubTabState = atom<TermMarksConfig>({
    key: "termMarks-state",
    default: {
        id: "",
        label: "",
        programStage: "",
        hasProgramStage: false,
        programIndicators: []
    }
})

export const EventsState = atom<any[]>({
    key: "events-state",
    default: []
})
