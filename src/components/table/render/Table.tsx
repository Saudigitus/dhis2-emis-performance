import React, { useEffect, useState } from 'react'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { HeaderFilters, Pagination, TableComponent } from '../components'
import RenderHeader from './RenderHeader'
import RenderRows from './RenderRows'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import WithBorder from '../../template/WithBorder';
import WithPadding from '../../template/WithPadding';
import WorkingLists from '../components/filters/workingList/WorkingLists';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { HeaderFieldsState } from '../../../schema/headersSchema';
import { EventsState } from '../../../schema/termMarksSchema';
import { useHeader, useParams, useTableData } from '../../../hooks';
import { TeiRefetch } from '../../../schema/refecthTeiSchema';
import { TableDataLoadingState } from '../../../schema/tableDataLoadingSchema';
import { getDataStoreKeys, getSelectedKey } from '../../../utils';
import { useGetEvents } from '../../../hooks/events/useGetEvents';
import AlertDialog from '../../confirm/confirm';

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
    const { orgUnit } = urlParamiters()
    const setLoading = useSetRecoilState(TableDataLoadingState)
    const { getDataStoreData } = getSelectedKey()
    const { program } = getDataStoreKeys()
    const { getEvents } = useGetEvents()
    const monitoriaEvents = useRecoilValue(EventsState);

    useEffect(() => {
        setLoading(loading)
    }, [loading])

    useEffect(() => {
        setpage(1)
    }, [headerFieldsState])

    useEffect(() => {
        if (orgUnit)
            void getData(page, pageSize, getDataStoreData?.registration?.programStage, [])
    }, [headerFieldsState, page, pageSize])

    useEffect(() => {
        if (orgUnit)
            void getEvents(page, pageSize, program, getDataStoreData?.monitoria?.programStage, headerFieldsState.dataElements, headerFieldsState.attributes, orgUnit)
    }, [headerFieldsState, refetch])

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
                <h4 className={classes.h4}>Monitoria das ASCAS</h4>
                {/* <WorkingLists /> */}
            </div>
            <WithBorder type='bottom' />
            <WithPadding >
                <WithBorder type='all' >
                    <HeaderFilters />
                    <div
                        className={classes.tableContainer}
                    >
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
                                        events={monitoriaEvents}
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
