import { attributesProps } from "../api/WithRegistrationProps"
import { dataValuesProps } from "../api/WithoutRegistrationProps"
import { ProgramConfig } from "../programConfig/ProgramConfig"

interface programIndicators {
    programIndicator: string
    value: string
}
interface FormatResponseRowsProps {
    eventsInstances: [{
        enrollment: string
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    teiInstances: [{
        enrollments: any
        trackedEntity: string
        attributes: attributesProps[]
        orgUnit: string
    }]
    marksInstances: [{
        status: boolean
        enrollment: string
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    programIndicatorsInstances: [{
        trackedEntity: string
        programIndicators: programIndicators[]
    }]
    programStage: string | null
    setImmutableTeiData: (immutableTeiData: any) => void
}

interface FormatResponseRowsMarksProps {
    marksInstance: {
        trackedEntity: string
        dataValues: dataValuesProps[]
    },
    programStage?: string
}

type RowsDataProps = Record<string, string | number | boolean | any>;

interface defaultProps {
    metaData: string
    program: ProgramConfig
    value: string
}

export type { FormatResponseRowsProps, FormatResponseRowsMarksProps, RowsDataProps, defaultProps }
