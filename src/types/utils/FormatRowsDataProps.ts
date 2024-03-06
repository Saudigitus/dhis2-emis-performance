import { attributesProps } from "../api/WithRegistrationProps"
import { dataValuesProps } from "../api/WithoutRegistrationProps"
import { CustomAttributeProps } from "../variables/AttributeColumns"

interface FormatResponseRowsProps {
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

interface FormatResponseRowsMarksProps {
    marksInstance: {
        trackedEntity: string
        dataValues: dataValuesProps[]
    }
}

type RowsDataProps = Record<string, string | number | boolean | any>;

export type { FormatResponseRowsProps, FormatResponseRowsMarksProps, RowsDataProps}
