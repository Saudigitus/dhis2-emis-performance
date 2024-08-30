interface TabElementsProps {
  order: string,
  name: string
  value: string
  programStage: string
}

interface TabBarProps {
  elements: TabElementsProps[]
  selectedValue: any
  setSelectedValue: (arg: any) => void
}

export type { TabElementsProps, TabBarProps }
