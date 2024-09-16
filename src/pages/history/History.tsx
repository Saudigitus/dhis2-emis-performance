import { useState, useEffect } from 'react'
import RenderHeader from "../../components/table/render/RenderHeader";
import RenderRows from "../../components/table/render/RenderRows";
import { WithBorder } from "../../components";
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { usetStyles } from '../../components/table/render/Table';
import { useGetEvents } from '../../hooks/events/useGetEvents';
import { formatResponse, getSelectedKey } from '../../utils';
import { dataValues } from '../../utils/table/rows/formatResponseRows';
import { ProgramConfigState } from '../../schema/programSchema';
import { useRecoilValue } from 'recoil';
import { TableComponent, Pagination } from '../../components/table/components';
import { WithPadding } from '../../components';
import { Paper } from '@material-ui/core';
import { useParams } from '../../hooks';
import { format } from 'date-fns';
import { TeiRefetch } from '../../schema/refecthTeiSchema';
import { NoticeBox } from '@dhis2/ui'
import styles from './History.module.css'

export default function History() {
  const [page, setpage] = useState(1)
  const programConfigState = useRecoilValue(ProgramConfigState);
  const { getDataStoreData } = getSelectedKey()
  const [columns,] = useState<any>(formatResponse({ programTrackedEntityAttributes: [] } as unknown as any, '', [], [], [], programConfigState?.programStages.find(x => x.id == getDataStoreData?.financiamento?.programStage)).filter((x: any) => x.id != "totalFinancimanetos" && x.id != "totalRecebido"))
  const [pageSize, setpageSize] = useState(10)
  const [totalRecebido, setTotalRecebido] = useState(10)
  const [tableData, setTableData] = useState<any>([])
  const classes = usetStyles()
  const { getEvents, loading, data } = useGetEvents()
  const { urlParamiters } = useParams()
  const { tei, teiOU, orgUnitName } = urlParamiters()
  const refetch = useRecoilValue(TeiRefetch)

  useEffect(() => {
    void getEvents(page, pageSize, getDataStoreData?.program, getDataStoreData?.financiamento?.programStage, [], [], teiOU, tei as unknown as string)
  }, [page, pageSize, refetch])

  useEffect(() => {
    let formatedDataValues = []
    let finaceCounter: any = 0

    for (const event of data) {
      finaceCounter += Number.parseInt(event.dataValues.find((x: any) => x.dataElement === getDataStoreData.financiamento.valorRecebido)?.value ?? 0)
      formatedDataValues.push({ ...dataValues(event?.dataValues), event: event.event, eventDate: format(new Date(event.occurredAt), "yyyy-MM-dd"), occurredAt: format(new Date(event.occurredAt), "yyyy-MM-dd") })
    }

    setTableData(formatedDataValues)
    setTotalRecebido(finaceCounter)
  }, [data])

  const onPageChange = (newPage: number) => {
    setpage(newPage)
  }

  const onRowsPerPageChange = (event: any) => {
    setpageSize(parseInt(event.value, 10))
    setpage(1)
  }


  return (
    <Paper>
      <WithPadding>
        <div style={{ display: "flex", justifyContent: "space-between" }} >
          <h4 className={classes.h4}>Histórico de financiamento de {orgUnitName}</h4>
          <NoticeBox className={styles.noticeBox} > <span style={{ fontWeight: "500" }} >Total</span>: {totalRecebido}.00 MT </NoticeBox>
        </div>
      </WithPadding>

      <WithPadding>
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
                    editOption={true}
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
    </Paper>
  )
}