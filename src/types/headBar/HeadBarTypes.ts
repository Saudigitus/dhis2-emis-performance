interface HeadBarTypes {
    id: string
    label: string
    value: string
    placeholder: string
    component?: string
    dataElementId?: string
    selected?: boolean
    disabled?: boolean
    options?: any[]
}

interface SelectedOptionsTypes {
    tab: string | null
    program: string | null
    orgUnit: string | null
    orgUnitName: string | null
}
export type { HeadBarTypes, SelectedOptionsTypes }
