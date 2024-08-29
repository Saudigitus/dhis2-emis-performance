import { findObject } from "../commons/findObject"

const returnTeiProgramIndicators = (trackedEntity: string, programIndicatorData: any) => {
    const headers = findObject(programIndicatorData, 'headers')
    const rows = findObject(programIndicatorData, 'rows')

    return {
        trackedEntity: trackedEntity,
        programIndicators: headers.map((item: {name: string}, index: number) => ({
            programIndicator: item.name,
            value: rows[0]?.[index] ?? ""
        }))
    }

}

export { returnTeiProgramIndicators }