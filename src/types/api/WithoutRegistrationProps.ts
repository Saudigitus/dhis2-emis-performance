export const fieldsType = {
    programStage: "executionDateLabel,programStageDataElements[displayInReports,compulsory,dataElement[id,displayName,valueType,optionSet[options[code~rename(value),displayName~rename(label)]]]],programStageSections[displayName,id,displayInReports,compulsory,dataElements[id,formName~rename(displayName),valueType,optionSet[options[code~rename(value),displayName~rename(label)]]]]",
    programStageSection: "executionDateLabel,programStageSections[displayName,id,displayInReports,compulsory,dataElements[id,formName~rename(displayName),valueType,optionSet[options[code~rename(value),displayName~rename(label)]]]]"
}

interface EventQueryProps {
    page: number
    pageSize: number
    ouMode: string
    program: string
    order: string
    programStatus?: string
    programStage: string
    orgUnit: string
    filter?: string[]
    filterAttributes?: string[]
}

interface GetDataElementsProps {
    programStageId: string
    type?: keyof typeof fieldsType
}

interface dataValuesProps {
    dataElement: string
    value: string
}

interface EventQueryResults {
    results: {
        instances: [{
            enrollment: string
            trackedEntity: string
            dataValues: dataValuesProps[]
        }]
    }
}

export type { EventQueryProps, GetDataElementsProps, EventQueryResults, dataValuesProps }
