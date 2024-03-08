interface SimpleButtonsComponentProps {
    items: SimpleButtonsType[]
    selectedTerm: any
    setSelectedTerm: (arg: any) => void
  }
interface SimpleButtonsType {
    id: string
    label?: string
    type: string
}

export type { SimpleButtonsComponentProps, SimpleButtonsType }
