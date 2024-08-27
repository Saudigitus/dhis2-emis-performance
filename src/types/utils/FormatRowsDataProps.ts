import { attributesProps } from "../api/WithRegistrationProps"
import { dataValuesProps } from "../api/WithoutRegistrationProps"
import { ProgramConfig } from "../programConfig/ProgramConfig"

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
    }]
    marksInstances: [{
        enrollment: string
        trackedEntity: string
        dataValues: dataValuesProps[]
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
