import React, { useState, useEffect } from 'react';
import { DataTable, DataTableBody, DataTableCell, DataTableRow, } from '@dhis2/ui'
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { RowSelectorState } from '../../schema/rowSelectorSchema';

interface SummaryRowProps {
    data: any
    reference: string
    tab: string
    index: number
}

export const ModalTable = ({ tableData }: { tableData: any }): React.ReactElement => {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const selectedEvents = useRecoilValue(RowSelectorState)
    const [page, setPage] = useState(1)
    let selectedRowsData: any = []

    Object.keys(selectedEvents ?? {})?.map((rowEventID) => {
        const asca = tableData?.find((x: any) => x.trackedEntity === selectedEvents?.[rowEventID].trackedEntity)

        if (asca) selectedRowsData.push(asca)
    })

    const headers = programConfigState?.programTrackedEntityAttributes?.filter(x => x.displayInList).map((item) => {
        return {
            id: item.trackedEntityAttribute.id,
            displayName: item.trackedEntityAttribute.displayName,
        }
    })

    return (
        <div style={{ maxHeight: "220px", overflowY: "auto" }} >
            <DataTable>
                <thead>
                    <tr>
                        {
                            headers.map((header) => {
                                return <th style={{ textAlign: "center", background: "#eee", fontSize: "15px", padding: "10px", fontWeight: "400" }}>{header.displayName}</th>
                            })
                        }
                    </tr>
                </thead>
                <DataTableBody>
                    {
                        selectedRowsData?.map((row: any) => {
                            return (
                                <DataTableRow >
                                    {
                                        headers.map((cell) => <DataTableCell align="center">{row?.[cell?.id]}</DataTableCell>)
                                    }
                                </DataTableRow>
                            )
                        })
                    }
                </DataTableBody>
            </DataTable >
        </div>
    )
}
