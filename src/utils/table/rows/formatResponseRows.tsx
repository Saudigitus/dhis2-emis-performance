interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

interface formatResponseRowsProps {
    eventsInstances: [{
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    teiInstances: [{
        trackedEntity: string
        attributes: attributesProps[]
    }]
    marksInstances: [{
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    setImmutableTeiData: (immutableTeiData: any) => void
}

interface formatResponseRowsMarksProps {
    marksInstance: {
        trackedEntity: string
        dataValues: dataValuesProps[]
    }
}

type RowsProps = Record<string, string | number | boolean | any>;

export function formatResponseRows({ eventsInstances, teiInstances, marksInstances, setImmutableTeiData }: formatResponseRowsProps): RowsProps[] {
    const allRows: RowsProps[] = []
    for (const event of eventsInstances) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        const marksDetails = marksInstances.find(mark => mark.trackedEntity === event.trackedEntity)
        setImmutableTeiData((prevState: any) => [...prevState, { ...dataValues(event.dataValues), ...(attributes((teiDetails?.attributes) ?? [])), trackedEntity: event.trackedEntity }])
        allRows.push({ ...dataValues(event.dataValues), ...(marksDetails !== undefined ? { ...dataValues(marksDetails.dataValues) } : {}), ...(attributes((teiDetails?.attributes) ?? [])), trackedEntity: event.trackedEntity })
    }
    return allRows;
}

export function formatResponseRowsMarks({ marksInstance }: formatResponseRowsMarksProps): RowsProps[] {
    return dataValues(marksInstance?.dataValues ?? [])
}

function dataValues(data: dataValuesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const dataElement of data) {
        localData[dataElement.dataElement] = dataElement.value
    }
    return localData
}

function attributes(data: attributesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const attribute of data) {
        localData[attribute.attribute] = attribute.value
    }
    return localData
}
