import React, { useEffect, useState } from 'react'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { HeaderFilters, Pagination, TableComponent } from '../components'
import RenderHeader from './RenderHeader'
import RenderRows from './RenderRows'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import WithBorder from '../../template/WithBorder';
import WithPadding from '../../template/WithPadding';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { HeaderFieldsState } from '../../../schema/headersSchema';
import { useHeader, useParams, useTableData } from '../../../hooks';
import { TeiRefetch } from '../../../schema/refecthTeiSchema';
import { TableDataLoadingState } from '../../../schema/tableDataLoadingSchema';
import { getDataStoreKeys, getSelectedKey } from '../../../utils';
import { useGetEvents } from '../../../hooks/events/useGetEvents';
import AlertDialog from '../../confirm/confirm';
import { RowSelectorState } from '../../../schema/rowSelectorSchema';

const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    },
    workingListsContainer: {
        display: 'flex',
        marginLeft: '0.5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    h4: {
        fontSize: '22px',
        fontWeigth: '500',
        padding: "10px 0 10px 0"
    }
});

function Table() {
    const classes = usetStyles()
    const { columns } = useHeader()
    const { getData, loading, tableData } = useTableData()
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const [page, setpage] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [refetch] = useRecoilState(TeiRefetch)
    const { urlParamiters } = useParams()
    const { orgUnit, moduloAdministrativo } = urlParamiters()
    const setLoading = useSetRecoilState(TableDataLoadingState)
    const { getDataStoreData } = getSelectedKey()
    const { program } = getDataStoreKeys()
    const { getEvents, events, loadingMonitoriaEvents } = useGetEvents()
    const [allChecked, setAllChecked] = useState(false)
    const setSelectedRows = useSetRecoilState(RowSelectorState)

    useEffect(() => {
        setLoading(loading)
    }, [loading])

    useEffect(() => {
        setpage(1)
    }, [headerFieldsState])

    useEffect(() => {
        setAllChecked(false)
        if (orgUnit)
            void getData(page, pageSize, getDataStoreData?.registration?.programStage, [])
    }, [page, pageSize, orgUnit])

    useEffect(() => {
        if (orgUnit) {
            if (allChecked) setAllChecked(false)
            setSelectedRows({})
            void getEvents(1, 1, program, getDataStoreData?.monitoria?.programStage, [`${getDataStoreData.monitoria?.filters?.dataElements[0].dataElement}:in:${moduloAdministrativo}`], [], orgUnit, false)
        }
    }, [refetch, orgUnit, moduloAdministrativo])

    const onPageChange = (newPage: number) => {
        setpage(newPage)
    }

    const onRowsPerPageChange = (event: any) => {
        setpageSize(parseInt(event.value, 10))
        setpage(1)
    }

    return (
        <Paper>
            <div className={classes.workingListsContainer}>
                <h4 className={classes.h4}>Fortalecimento das ASCAS</h4>
                {/* <WorkingLists /> */}
            </div>
            <WithBorder type='bottom' />
            <WithPadding >
                <WithBorder type='all' >
                    <HeaderFilters tableData={tableData} />
                    <div className={classes.tableContainer}>
                        {(loading || loadingMonitoriaEvents) ?
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
                                        rowsData={tableData}
                                        allChecked={allChecked}
                                        setAllChecked={setAllChecked}
                                        events={events}
                                    />
                                    <RenderRows
                                        loader={loading}
                                        headerData={columns}
                                        rowsData={tableData}
                                        events={events}
                                        allChecked={allChecked}
                                        setAllChecked={setAllChecked}
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
            <AlertDialog />
        </Paper>
    )
}

export default Table
