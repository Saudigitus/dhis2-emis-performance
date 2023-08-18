import { atom } from "recoil"
import { z } from "zod"

export const termMarksSchema = z.object({
    id: z.string(),
    label: z.string().optional(),
    type: z.string()
})

export type TermMarksSchema = z.infer<typeof termMarksSchema>

export const TermMarksState = atom<TermMarksSchema>({
    key: "termMarks-state",
    default: {
        id: "",
        label: "",
        type: ""
    }
})
