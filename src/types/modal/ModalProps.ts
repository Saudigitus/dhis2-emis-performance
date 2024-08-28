interface ModalProps {
  open: boolean
  setOpen: (value: boolean) => void
  title: string
  children: React.ReactNode
}

interface ModalContentProps {
  setOpen: (value: boolean) => void
}

interface ModalExportTemplateProps {
  setOpen: (value: boolean) => void
  sectionName: string
}

interface useExportTemplateProps {
  academicYearId: string
  orgUnit: string
  orgUnitName: string
  studentsNumber: string
  setLoadingExport?: any
  gradeId: string
}

export type {
  ModalProps,
  ModalContentProps,
  ModalExportTemplateProps,
  useExportTemplateProps
}
