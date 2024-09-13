import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { EventsState } from "../../schema/termMarksSchema";
import { type TableDataProps, type EventQueryProps, type TeiQueryProps, type MarksQueryResults, type EventQueryResults, type TeiQueryResults } from "../../types/table/TableData";
import { formatResponseRowsMarks, formatResponseRows, getDataStoreKeys, getSelectedKey } from "../../utils";
import { useGetProgramIndicators } from "../programIndicators/useGetProgramIndicators";
import { formatAttributesFilter } from "../../utils/tei/formatAttributesFilter";
import { returnTeiProgramIndicators } from "../../utils/tei/returnTeiProgramIndicators";
import { AllTeisSchema } from "../../schema/allTeisSchema";
import { useGetOrgUnitCode } from "../organisationUnit/useGetOrgUnitCode";
import { useGetEvents } from "../events/useGetEvents";
import { useGetNextActions } from "../programStages/useGetNextActions";
import { teiHasEvents } from "../../utils/table/rows/formatTeiHasEvents";

const EVENT_QUERY = (queryProps: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            fields: "*",
            ...queryProps
        }
    }
})

const TEI_QUERY = (queryProps: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt,program]",
            ...queryProps
        }
    }
})

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const [immutableTeiData, setImmutableTeiData] = useState<any[]>([]) // this variable receives the attributes and dataElements of the registragion programStage
    const { hide, show } = useShowAlerts()
    const [allTeis, setAllTeis] = useRecoilState(AllTeisSchema)
    const { program, assessment, dataStoreKey } = getDataStoreKeys()
    const [, setAllEvents] = useRecoilState(EventsState);
    const { orgUnit } = urlParamiters()
    const { getProgramIndicators } = useGetProgramIndicators()
    const { getOrgUnitCode } = useGetOrgUnitCode()
    const { getEvents } = useGetEvents()
    const { nextAction = [], tableStatus = [] } = useGetNextActions()
    const { getDataStoreData } = getSelectedKey()

    async function getData(page: number, pageSize: number, selectedProgramStage: string, selectedProgramIndicators: string[]) {
        setLoading(true)
        setAllEvents([])
        setImmutableTeiData([])

        const events: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: "DESCENDANTS",
            page,
            pageSize,
            // programStatus: "ACTIVE",
            program: program,
            order: "createdAt:desc",
            programStage: selectedProgramStage,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: orgUnit as unknown as string
        })).catch((error) => {
            show({
                message: `${("Could not get events")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as EventQueryResults;

        const allTeis = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity)
        setAllTeis(allTeis)
        const trackedEntityToFetch = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity).toString().replaceAll(",", ";")

        let teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                ouMode: orgUnit != null ? "SELECTED" : "ACCESSIBLE",
                pageSize,
                program: program,
                trackedEntity: trackedEntityToFetch
            })).catch((error) => {
                show({
                    message: `${("Could not get tracked entities")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }) as unknown as TeiQueryResults
            : { results: { instances: [] } } as unknown as TeiQueryResults;

        const marskEvents: MarksQueryResults = {
            results: {
                instances: []
            }
        }

        if (teiResults?.results?.instances) {
            let counter = 0
            for (const tei of teiResults?.results?.instances) {
                const attId = assessment.programs.find(x => x?.program === tei.enrollments[0]?.program)?.attributes.find(x => x.attributeName == 'parentId')?.attribute
                const ouId = tei.attributes.find(x => x.attribute === attId)?.value
                let coounter = 0
                
                if (ouId) {
                    const teiName: any = await getOrgUnitCode(ouId as unknown as string, true)
                    teiResults.results?.instances[counter].attributes.map((x: any) => {
                        if (x.attribute === attId) x.value = teiName?.results?.name
                    })
                }

                const totalFinancimanetos = await getEvents(1, 1, program, getDataStoreData.financiamento.programStage, [], [], tei.orgUnit, tei.trackedEntity)
                const totalRecebido = await getEvents(1, 1, program, getDataStoreData.financiamento.programStage, [], [], tei.orgUnit, tei.trackedEntity, '', false)

                totalRecebido?.instances?.map((item: any) => {
                    coounter += Number.parseInt(item.dataValues.find((x: any) => x.dataElement === getDataStoreData.financiamento.valorRecebido).value)
                })

                teiResults.results.instances[counter].attributes = [
                    ...teiResults.results?.instances[counter].attributes,
                    { attribute: 'totalFinancimanetos', value: totalFinancimanetos?.total > 0 ? totalFinancimanetos?.total : '0' },
                    { attribute: 'totalRecebido', value: coounter }
                ]

                counter++
            }
        }

        // for (const action of tableStatus) {
        //     for (const tei of allTeis) {
        //         promises.push(getEvents(1, 1, program, action.programStage, [], [], orgUnit, tei))
        //     }
        // }

        // await Promise.all(promises)
        //     .then((responses) => {
        //         for (const response of responses) {
        //             if (response?.results?.instances.length)
        //                 nextPstageEvents.results.push(response?.results?.instances[0])
        //         }
        //     })

        // if (selectedProgramStage !== null && selectedProgramStage !== undefined && selectedProgramStage !== '') {
        //     for (const tei of allTeis) {
        //         const marksResults: MarksQueryResults = await fetchMarks(tei, selectedProgramStage)
        //         marskEvents?.results?.instances?.push(...marksResults?.results?.instances)
        //     }
        // }

        // console.log(nextPstageEvents, ...nextPstageEvents)
        // const programIndicatorsInstances = []

        // if (selectedProgramIndicators?.length) {
        //     for (const tei of teiResults?.results?.instances) {
        //         const programIndicatorsResults = await getProgramIndicators(selectedProgramIndicators, orgUnit, program, formatAttributesFilter(tei.attributes))

        //         programIndicatorsInstances.push(returnTeiProgramIndicators(tei.trackedEntity, programIndicatorsResults))
        //     }
        // }

        const localData = formatResponseRows({
            eventsInstances: events?.results?.instances ?? [],
            teiInstances: teiResults?.results?.instances,
            marksInstances: marskEvents?.results?.instances,
            setImmutableTeiData,
            programStage: selectedProgramStage
        })

        for (const row of localData) {
            setAllEvents((prev) => [...prev, marskEvents.results.instances.find((event: any) => (event.trackedEntity === row.trackedEntity) && (event.enrollment === row.enrollment))])
        }

        setTableData(localData);
        setLoading(false)
    }

    return {
        getData,
        tableData,
        loading
    }
}
