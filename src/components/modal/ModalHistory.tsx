import { useState, useEffect } from 'react'
import { Pagination, TableComponent } from "../table/components";
import RenderHeader from "../table/render/RenderHeader";
import RenderRows from "../table/render/RenderRows";
import WithBorder from "../template/WithBorder";
import WithPadding from "../template/WithPadding";
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { usetStyles } from '../table/render/Table';
import { useGetEvents } from '../../hooks/events/useGetEvents';
import { getSelectedKey } from '../../utils';
import { dataValues } from '../../utils/table/rows/formatResponseRows';

export default function ModalHistory({ setOpen, row }: { setOpen: (args: boolean) => void, row: any }) {
    const columns: any = []
    const [page, setpage] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const tableData: any = []
    const classes = usetStyles()
    const { getDataStoreData } = getSelectedKey()
    const { getEvents, loading, data } = useGetEvents()

    useEffect(() => {
        void getEvents(page, pageSize, getDataStoreData.program, getDataStoreData.financiamento.programStage, [], [], row.orgUnit, row.trackedEntity)
    }, [])

    const onPageChange = (newPage: number) => {
        setpage(newPage)
    }

    const onRowsPerPageChange = (event: any) => {
        setpageSize(parseInt(event.value, 10))
        setpage(1)
    }

    // console.log(dataValues()data,row)

    return (
        <div>
            <div className={classes.workingListsContainer}>
                <h4 className={classes.h4}>Histórico de financiamento de {row?.[getDataStoreData?.mappingVariables?.nomeAsca]}</h4>
            </div>
            <WithPadding >
                <WithBorder type='all' >
                    <div className={classes.tableContainer}  >
                        {loading ?
                            <CenteredContent className="p-4">
                                <CircularLoader />
                            </CenteredContent>
                            :
                            <TableComponent>
                                <>
                                    <RenderHeader
                                        createSortHandler={() => { }}
                                        order='asc'
                                        orderBy='desc'
                                        rowsHeader={columns}
                                    />
                                    <RenderRows
                                        loader={loading}
                                        headerData={columns}
                                        rowsData={tableData}
                                    />
                                </>
                            </TableComponent>
                        }
                    </div>
                    <Pagination
                        loading={loading}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        page={page}
                        rowsPerPage={pageSize}
                        totalPerPage={tableData?.length}
                    />
                </WithBorder>
            </WithPadding>
        </div>
    )
}