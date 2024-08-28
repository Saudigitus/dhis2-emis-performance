interface attendance {
  absenceReason: string
  programStage: string
  status: string
  statusOptions: [
    {
      code: string
      icon: string
    }
  ]
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
  destinySchool: string
  originSchool: string
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

interface dataStoreRecord {
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
}

export type {
  dataStoreRecord,
  transfer,
  registration,
  performance,
  attendance,
  simpleProgramStage,
  filterItem
}
