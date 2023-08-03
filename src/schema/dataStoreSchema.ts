import { atom } from "recoil"
import { z } from "zod"

export const dataStoreSchema = z.object({
    performance: z.object({
        programStages: z.array(
            z.object({
                programStage: z.string()
            })
        )
    }),
    registration: z.object({
        academicYear: z.string(),
        grade: z.string(),
        section: z.string(),
        programStage: z.string()
    }),
    program: z.string()
})

type DataStoreSchema = z.infer<typeof dataStoreSchema>

export const DataStoreState = atom<DataStoreSchema | undefined>({
    key: "dataStore-get-state",
    default: undefined
})
