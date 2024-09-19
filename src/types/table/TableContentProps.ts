import { CustomAttributeProps } from "../variables/AttributeColumns"
import { FieldFeedbackProps } from "./MarksFieldsFeedback"

interface TableProps {
    head: any
    footer: any
}

interface TableComponentProps {
    children?: React.ReactNode
    className?: string
}

interface HeaderCellProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
    colspan?: number
    onClick?: () => void
}

interface RowProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
    onClick?: () => void
    inactive?: boolean
}

interface RenderHeaderProps {
    loader?: boolean
    rowsHeader?: CustomAttributeProps[]
    orderBy?: string
    order?: "asc" | "desc"
    // TODO resolve this bug.👇
    createSortHandler?: (property: string) => any
    rowsData?: any[]
    headerData?: CustomAttributeProps[]
    events?: any[]
    setAllChecked: any
    allChecked?: any
    updateEvents?: any
}

interface TableSortProps {
    children?: React.ReactNode
    active: boolean
    direction?: 'asc' | 'desc'
    createSortHandler: (rowsPerPage: string) => void
}


type TableDataProps = Record<string, string>;

interface ShowFieldsBasedValueTypeProps {
    column: CustomAttributeProps
    loader?: boolean
    value: string
    currentEvent: any
    saveMarks: any
    showFeedBack: FieldFeedbackProps
    setShowFeedBack: any
    headers: CustomAttributeProps[]
    trackedEntity: string
    setPrevValues: (a: Object) => void
    prevValues: any
    disableInput: boolean
    inactive: boolean
    updateEvents?: any
}
interface RowActionsType {
    label: string
    onClick: (arg?: any) => void
    icon: React.ReactNode
    disabled: boolean
    color?: string
}
interface RowActionsProps {
    row: any
    event: any
    completed: boolean
    onSelectTei?: (arg: any) => void
    onShowHistory?: () => void,
    complete?: boolean
}

export type { TableComponentProps, HeaderCellProps, RowProps, RenderHeaderProps, TableSortProps, TableDataProps, ShowFieldsBasedValueTypeProps, RowActionsProps, RowActionsType }
