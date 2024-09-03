import { atom } from "recoil"
import { dataStoreRecord } from "../types/dataStore/DataStoreConfig"

export const DataStoreState = atom<dataStoreRecord[]>({
    key: "dataStore-get-state",
    default: []
})

export const DataSetPeriodState = atom<string | null>({
    key: "dataSet-period-state",
    default: null
})

export type attributeType = {
    attribute: string,
    attributeName: string
}

export type dataElementType = {
    dataElement: string,
    dataElementName: string
}
export type programStageType = {
    programStage: string,
    programStageName: string

}

export type programDataStoreType = {
    accessTo: string
    program: string
    programName: string
    dataElements?: dataElementType[]
    attributes: attributeType[]
    programStages: programStageType[]
} | undefined