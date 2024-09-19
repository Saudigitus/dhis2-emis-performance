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
import { TermMarksState } from '../../../schema/termMarksSchema';
import { useHeader, useParams, useTableData } from '../../../hooks';
import { TeiRefetch } from '../../../schema/refecthTeiSchema';
import { TableDataLoadingState } from '../../../schema/tableDataLoadingSchema';
import { CustomDhis2RulesEngine } from '../../../hooks/programRules/rules-engine/RulesEngine';
import { getSelectedKey } from '../../../utils';

const usetStyles = makeStyles({
  tableContainer: {
    overflowX: "auto"
  },
  workingListsContainer: {
    display: "flex",
    marginLeft: "0.5rem",
    alignItems: "center",
    justifyContent: "space-between"
  },
  h4: {
    margin: "0px",
    fontSize: "22px",
    fontWeigth: "500"
  }
})

function Table() {
  const classes = usetStyles()
  const { columns = [] } = useHeader()
  const { getData, loading, tableData, getMarks } = useTableData()
  const headerFieldsState = useRecoilValue(HeaderFieldsState)
  const [page, setpage] = useState(1)
  const [pageSize, setpageSize] = useState(10)
  const [refetch] = useRecoilState(TeiRefetch)
  const termMarksState = useRecoilValue(TermMarksState)
  const { urlParamiters } = useParams()
  const { academicYear, programStage, grade } = urlParamiters()
  const setLoading = useSetRecoilState(TableDataLoadingState)
  const { getDataStoreData } = getSelectedKey()
  const customColumns = columns?.map((column: any) => { return { ...column, name: column.id.split("_")[0] } })

  const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
    type: "programStage",
    variables: customColumns,
    formatKeyValueType: { [getDataStoreData.registration.grade as string]: "LIST" },
    values: { [getDataStoreData.registration.grade as string]: grade, testi: "test" }
  })

  useEffect(() => {
    if (grade) {
      runRulesEngine(customColumns)
    }
  }, [grade, programStage])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  useEffect(() => {
    setpage(1)
  }, [headerFieldsState])

  useEffect(() => {
    if (academicYear)
      void getData(page, pageSize, programStage as unknown as string)
  }, [headerFieldsState, page, pageSize, refetch])

  useEffect(() => {
    if (
      termMarksState.id !== null &&
      termMarksState.id !== undefined &&
      termMarksState.id !== "" &&
      academicYear
    ) {
      void getMarks(termMarksState.id)
    }
  }, [programStage])

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
        <h4 className={classes.h4}>Performance</h4>
        <WorkingLists />
      </div>
      <WithBorder type="bottom" />
      <WithPadding>
        <WithBorder type="all">
          <HeaderFilters />
          <div className={classes.tableContainer}>
            {loading ? (
              <CenteredContent className="p-4">
                <CircularLoader />
              </CenteredContent>
            ) : (
              <TableComponent>
                <>
                  <RenderHeader
                    createSortHandler={() => { }}
                    order="asc"
                    orderBy="desc"
                    rowsHeader={updatedVariables}
                  />
                  <RenderRows
                    loader={loading}
                    headerData={updatedVariables}
                    rowsData={tableData}
                  />
                </>
              </TableComponent>
            )}
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
    </Paper>
  )
}

export default Table
