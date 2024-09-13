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

export default function History() {
  const [page, setpage] = useState(1)
  const programConfigState = useRecoilValue(ProgramConfigState);
  const { getDataStoreData } = getSelectedKey()
  const [columns,] = useState<any>(formatResponse({ programTrackedEntityAttributes: [] } as unknown as any, '', [], [], [], programConfigState?.programStages.find(x => x.id == getDataStoreData?.financiamento?.programStage)).filter((x: any) => x.id != "totalFinancimanetos"))
  const [pageSize, setpageSize] = useState(10)
  const [tableData, setTableData] = useState<any>([])
  const classes = usetStyles()
  const { getEvents, loading, data } = useGetEvents()
  const { urlParamiters } = useParams()
  const { tei, teiOU, nome } = urlParamiters()

  useEffect(() => {
    void getEvents(page, pageSize, getDataStoreData?.program, getDataStoreData?.financiamento?.programStage, [], [], teiOU, tei as unknown as string)
  }, [page, pageSize])

  useEffect(() => {
    let formatedDataValues = []

    for (const event of data) {
      formatedDataValues.push({ ...dataValues(event?.dataValues), event: event.event, eventDate: format(new Date(event.occurredAt), "yyyy-MM-dd"), occurredAt: format(new Date(event.occurredAt), "yyyy-MM-dd") })
    }

    setTableData(formatedDataValues)
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
        <h4 className={classes.h4}>Histórico de financiamento de {nome}</h4>
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