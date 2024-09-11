import React, { useState, useEffect } from 'react';
import { DataTable, DataTableBody, DataTableCell, DataTableRow, } from '@dhis2/ui'
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { RowSelectorState } from '../../schema/rowSelectorSchema';
import { Pagination } from '../table/components';
import WithPadding from '../template/WithPadding';

export const ModalTable = ({ tableData }: { tableData: any }): React.ReactElement => {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const selectedEvents = useRecoilValue(RowSelectorState)
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])

    useEffect(() => {
        let selectedRowsData: any = []
        Object.keys(selectedEvents ?? {})?.map((rowEventID) => {
            const asca = tableData?.find((x: any) => x.trackedEntity === selectedEvents?.[rowEventID].trackedEntity)
            if (asca) selectedRowsData.push(asca)
        })

        setData(selectedRowsData.slice((page - 1) * 5, page * 5))
    }, [page])


    const headers = programConfigState?.programTrackedEntityAttributes?.filter(x => x.displayInList).map((item) => {
        return {
            id: item.trackedEntityAttribute.id,
            displayName: item.trackedEntityAttribute.displayName,
        }
    })

    const onPageChange = (newPage: number) => {
        setPage(newPage)
    }

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
                        data?.map((row: any) => {
                            return (
                                <DataTableRow >
                                    {
                                        headers.map((cell) => <DataTableCell align="center">{row?.[cell?.id]}</DataTableCell>)
                                    }
                                </DataTableRow>
                            )
                        })
                    }
                    {data.length === 0 && <DataTableRow>
                        <WithPadding p='10px' >
                            Sem mais dados para mostrar
                        </WithPadding>
                    </DataTableRow>}
                </DataTableBody>
            </DataTable >

            <Pagination
                loading={false}
                onPageChange={onPageChange}
                onRowsPerPageChange={() => { }}
                page={page}
                rowsPerPage={5}
                totalPerPage={data?.length}
                option={[{ value: 5, label: 5 }]}
            />
        </div>
    )
}
