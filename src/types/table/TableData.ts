import { attributesProps } from "../api/WithRegistrationProps";
import { dataValuesProps } from "../api/WithoutRegistrationProps";
import { enrollmentStatus } from "../variables/AttributeColumns";

export type TableDataProps = Record<string, string>;

export interface EventQueryProps {
    page?: number
    pageSize?: number
    ouMode?: string
    program: string
    order: string
    programStage: string
    trackedEntity?: string
    orgUnit?: string
    filter?: string[]
    filterAttributes?: string[]
}

export interface TeiQueryProps {
    program: string
    pageSize?: number
    ouMode?: string
    trackedEntity: string
    orgUnit?: string
    order?: string
}

export interface EventQueryResults {
    results: {
        instances: [{
            status: enrollmentStatus
            event: string
            enrollment: string
            trackedEntity: string
            dataValues: dataValuesProps[]
        }]
    }
}

export interface MarksQueryResults {
    results: {
        instances: any
    }
}

export interface TeiQueryResults {
    results: {
        instances: [{
            enrollments: any
            trackedEntity: string
            orgUnit: string
            attributes: attributesProps[]
        }]
    }
}
