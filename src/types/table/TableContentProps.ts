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
}
export type { TableComponentProps, HeaderCellProps, RowProps, RenderHeaderProps, TableSortProps, TableDataProps, ShowFieldsBasedValueTypeProps }