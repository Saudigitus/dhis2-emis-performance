import { attributesProps } from "../../../types/api/WithRegistrationProps"
import { dataValuesProps } from "../../../types/api/WithoutRegistrationProps"
import { FormatResponseRowsMarksProps, FormatResponseRowsProps, RowsDataProps } from "../../../types/utils/FormatRowsDataProps"

export function formatResponseRows({ eventsInstances, teiInstances, marksInstances, programIndicatorsInstances, setImmutableTeiData, programStage }: FormatResponseRowsProps): RowsDataProps[] {

    const allRows: RowsDataProps[] = []
    for (const event of eventsInstances) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        const marksDetails = marksInstances.find(mark => (mark.trackedEntity === event.trackedEntity) && (mark?.enrollment === event?.enrollment))

        setImmutableTeiData((prevState: any) => [...prevState, {
            ...dataValues(event.dataValues), ...(attributes((teiDetails?.attributes) ?? [])),
            trackedEntity: event.trackedEntity,
            enrollment: event?.enrollment,
            status: teiDetails?.enrollments?.[0]?.status
        }])
        
        allRows.push({
            ...dataValues(event.dataValues),
            ...(marksDetails !== undefined ? { ...dataValues(marksDetails.dataValues, programStage) } : {}),
            ...(attributes((teiDetails?.attributes) ?? [])),
            ...(programIndicators(programIndicatorsInstances?.find(x => x.trackedEntity === event.trackedEntity)?.programIndicators ?? [])),
            trackedEntity: event.trackedEntity,
            enrollment: event?.enrollment,
            status: teiDetails?.enrollments?.[0]?.status,
            eventStatus: event?.status as unknown as any,
            event: event?.event as unknown as any,
            orgUnit: teiDetails?.enrollments?.[0]?.orgUnit,
        })
    }
    return allRows;
}

export function formatResponseRowsMarks({ marksInstance, programStage }: FormatResponseRowsMarksProps): RowsDataProps {
    return dataValues(marksInstance?.dataValues ?? [], programStage)
}

export function dataValues(data: dataValuesProps[], programStage?: string | null): RowsDataProps {
    const localData: RowsDataProps = {}
    for (const dataElement of data) {
        let key = programStage ? dataElement.dataElement + '_' + programStage : dataElement.dataElement
        localData[key] = dataElement.value
    }
    return localData
}

function attributes(data: attributesProps[]): RowsDataProps {
    const localData: RowsDataProps = {}
    for (const attribute of data) {
        localData[attribute.attribute] = attribute.value
    }
    return localData
}

function programIndicators(data: any[]): RowsDataProps {
    const localData: RowsDataProps = {}
    for (const programIndicator of data) {
        localData[programIndicator.programIndicator] = programIndicator.value
    }
    return localData
}

function getNextProgramStages(data: any[], trackedEntity: string) {
    return data?.find((x) => x.trackedEntity === trackedEntity)
}