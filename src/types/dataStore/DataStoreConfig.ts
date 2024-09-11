import { programDataStoreType } from "../../schema/dataStoreSchema"

interface attendance {
    absenceReason: string
    programStage: string
    status: string
    statusOptions: [{
        code: string
        icon: string
    }]
}

interface simpleProgramStage {
    programStage: string
}

interface performance {
    programStages: simpleProgramStage[]
}

interface registration {
    academicYear: string
    programStage: string
    grade?: string
    section?: string
    position?: string
    employmentType?: string
}

interface transfer {
    destinyorgUnit: string
    originorgUnit: string
    programStage: string
    status: string
}

interface defaults {
    currentAcademicYear: string
}

interface filterItem {
    code: string
    dataElement: string
    order: number
}

interface filters {
    dataElements: filterItem[]
}

type nextProgramStageType = {
    displayName: string,
    programStage: string,
    columnName: string
}

interface tabGroupItem {
    order: string,
    label: string
    programStage: string
    nextAction?: nextProgramStageType[]
}

interface assessment {
    groupsLevel: string
    lastChildLevel: number
    tabGroups: tabGroupItem[]
    programs: programDataStoreType[]
    files_id: {
        ficha: string
    }
    trackedEntityTypes: {
        groups: string,
    },
    tableStatus: nextProgramStageType[]
}

interface dataStoreRecord {
    assessment: assessment
    attendance: attendance
    key: string
    trackedEntityType: string
    lastUpdate: string
    performance?: performance
    program: string
    registration: registration
    ["socio-economics"]: simpleProgramStage
    transfer: transfer
    ["final-result"]: simpleProgramStage
    defaults: defaults
    filters: filters
    mappingVariables: {
        "nomeAsca": string,
        "homensAdultos": string
        "homensJovens": string
        "mulheresAdultas": string
        "mulheresJovens": string
    }
    financiamento: {
        programStage: string
    }
}


export type { dataStoreRecord, transfer, registration, performance, attendance, simpleProgramStage, filterItem, assessment, nextProgramStageType }