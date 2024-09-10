
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

interface tabGroupItem {
    order: string,
    label: string
    programStage: string
    nextAction?: {
        displayName: string,
        programStage: string
    }
}

interface assessment {
    tabGroups: tabGroupItem[]
}

interface monitoria {
    filters: filters
    programStage: string
    facilitadores: {
        treinador: string
    }
}

interface dataStoreRecord {
    assessment: assessment
    attendance: attendance
    monitoria: monitoria
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
}


export type { dataStoreRecord, transfer, registration, performance, attendance, simpleProgramStage, filterItem, assessment }