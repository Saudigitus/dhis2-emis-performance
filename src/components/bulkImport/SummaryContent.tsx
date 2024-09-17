import React, {useState} from 'react';
import {
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow
} from '@dhis2/ui'
import {ErrorDetailsTable} from "./ErrorDetailsTable";

interface SummaryRowProps {
    data: any
    reference: string
    expandedRows: any[]
    expandedToggle: any
    showErrorsOrConflicts: boolean
    // hasConflicts?: boolean
}

export const SummaryRow = (props: SummaryRowProps): React.ReactElement => {
    const {
        data,
        reference,
        expandedRows,
        expandedToggle,
        showErrorsOrConflicts
    } = props
    // const rowHasErrors = data?.errors !== undefined
    // const showPaddingCell = showErrorsOrConflicts && !rowHasErrors
    return showErrorsOrConflicts
        ? (
            <DataTableRow
                expanded={expandedRows.includes(reference)}
                onExpandToggle={() => expandedToggle(`${reference}`)}
                expandableContent={<ErrorDetailsTable errors={data?.errors} data={data}/>}
            >
                {/* {showErrorsOrConflicts && <DataTableCell/>} */}
                <DataTableCell>{data?.trackedEntity}</DataTableCell>
                <DataTableCell>{data?.orgUnit}</DataTableCell>
                <DataTableCell>{data?.event}</DataTableCell>
            </DataTableRow>
        )
        : (
            <DataTableRow>
                <DataTableCell>{data?.trackedEntity}</DataTableCell>
                <DataTableCell>{data?.orgUnit}</DataTableCell>
                <DataTableCell>{data?.event}</DataTableCell>
            </DataTableRow>
        )
}

interface SummaryTableProps {
    displayData?: Array<Record<string, any>>
    // mandatoryFields?: any[]
    showErrorsOrConflicts: boolean
    activeTab: string
}

export const SummaryTable = (props: SummaryTableProps): React.ReactElement => {
    const {
        displayData,
        showErrorsOrConflicts,
        activeTab
    } = props
    const [expandedRows, setExpandedRows] = useState<string[]>([])
    const recordsName = activeTab === "new" ? "new students" : activeTab
    const expandedToggle = (rowId: string) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((row) => row !== rowId))
        } else {
            setExpandedRows([...expandedRows, rowId])
        }
    }
    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    {(showErrorsOrConflicts && ["invalids", "conflicts"].includes(activeTab)) && <DataTableColumnHeader/>}
                    <DataTableColumnHeader>Student ID</DataTableColumnHeader>
                    <DataTableColumnHeader>School ID</DataTableColumnHeader>
                    <DataTableColumnHeader>Event ID</DataTableColumnHeader>
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                {
                    ((displayData?.length ?? 0) > 0) && displayData?.map(student => (
                        <SummaryRow
                            key={`student-${student.ref}-${student?.trackedEntity ?? ""}`}
                            reference={`student-${student.ref}-${student?.trackedEntity ?? ""}`}
                            data={student}
                            expandedRows={expandedRows}
                            expandedToggle={expandedToggle}
                            showErrorsOrConflicts={showErrorsOrConflicts}
                        />
                    ))
                }
                {(displayData?.length === 0) &&
                    <DataTableRow>
                        <DataTableCell>{`No ${recordsName} to display!`}</DataTableCell>
                    </DataTableRow>
                }
            </DataTableBody>
        </DataTable>
    )
}
