import { attributesProps } from "../../../types/api/WithRegistrationProps"
import { dataValuesProps } from "../../../types/api/WithoutRegistrationProps"
import { FormatResponseRowsMarksProps, FormatResponseRowsProps, RowsDataProps } from "../../../types/utils/FormatRowsDataProps"

export function formatResponseRows({ eventsInstances, teiInstances, marksInstances, setImmutableTeiData }: FormatResponseRowsProps): RowsDataProps[] {
    const allRows: RowsDataProps[] = []
    for (const event of eventsInstances) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        const marksDetails = marksInstances.find(mark => mark.trackedEntity === event.trackedEntity)
        setImmutableTeiData((prevState: any) => [...prevState, { ...dataValues(event.dataValues), ...(attributes((teiDetails?.attributes) ?? [])), trackedEntity: event.trackedEntity }])
        allRows.push({ ...dataValues(event.dataValues), ...(marksDetails !== undefined ? { ...dataValues(marksDetails.dataValues) } : {}), ...(attributes((teiDetails?.attributes) ?? [])), trackedEntity: event.trackedEntity })
    }
    return allRows;
}

export function formatResponseRowsMarks({ marksInstance }: FormatResponseRowsMarksProps): RowsDataProps {
    return dataValues(marksInstance?.dataValues ?? [])
}

function dataValues(data: dataValuesProps[]): RowsDataProps {
    const localData: RowsDataProps = {}
    for (const dataElement of data) {
        localData[dataElement.dataElement] = dataElement.value
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
