import { atom } from "recoil"
import { z } from "zod"

export const termMaksSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string()
})

export type TermMaksSchema = z.infer<typeof termMaksSchema>

export const TermMaksState = atom<TermMaksSchema>({
    key: "termMaks-state",
    default: {
        id: "",
        name: "",
        type: ""
    }
})
