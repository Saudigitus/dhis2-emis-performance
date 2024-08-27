interface TabElementsProps {
    name: string
    value: string
  }

interface TabBarProps {
    elements: TabElementsProps[]
    selectedValue: any
    setSelectedValue: (arg: any) => void
}

export type { TabElementsProps, TabBarProps}
