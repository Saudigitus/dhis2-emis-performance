import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { EventsState, SubTabState } from "../../schema/termMarksSchema";
import { type TableDataProps, type EventQueryProps, type TeiQueryProps, type MarksQueryResults, type EventQueryResults, type TeiQueryResults } from "../../types/table/TableData";
import { formatResponseRowsMarks, formatResponseRows, getDataStoreKeys } from "../../utils";
import { useGetProgramIndicators } from "../programIndicators/useGetProgramIndicators";
import { formatAttributesFilter } from "../../utils/tei/formatAttributesFilter";
import { returnTeiProgramIndicators } from "../../utils/tei/returnTeiProgramIndicators";
import { AllTeisSchema } from "../../schema/allTeisSchema";

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
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt]",
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
    const { program, registration } = getDataStoreKeys()
    const [, setAllEvents] = useRecoilState(EventsState);
    const { orgUnit } = urlParamiters()
    const { getProgramIndicators } = useGetProgramIndicators()

    const fetchMarks = async (tei: string, programStageId: string) => {
        return await engine.query(EVENT_QUERY({
            program: program,
            order: "createdAt:desc",
            programStage: programStageId,
            trackedEntity: tei
        })).catch((error) => {
            show({
                message: `${("Could not get marks")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as MarksQueryResults;
    }

    const getMarks = async (programStageId: string) => {
        setLoading(true)
        setAllEvents([])
        let localData: any = []
        localData = [...immutableTeiData]

        const marskEvents: MarksQueryResults = {
            results: {
                instances: []
            }
        }

        // Get the events from the programStage marks for the each student
        for (const tei of allTeis) {
            const marksResults: MarksQueryResults = await fetchMarks(tei, programStageId)
            marskEvents.results.instances.push(...marksResults?.results?.instances)
        }

        for (let i = 0; i < localData.length; i++) {
            const marksDetails = marskEvents?.results?.instances?.find((event: any) => (event.trackedEntity === localData[i]?.trackedEntity) && (event?.enrollment === localData[i]?.enrollment));
            if (marksDetails !== undefined) {
                localData[i] = { ...localData[i], ...formatResponseRowsMarks({ marksInstance: marksDetails, programStage: programStageId }) }
            }
        }

        for (const row of localData) {
            setAllEvents((prev) => [...prev, marskEvents.results.instances.find((event: any) => (event.trackedEntity === row.trackedEntity) && (event.enrollment === row.enrollment))])
        }

        setTableData(localData);
        setLoading(false)
    }

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

        const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
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



        // if (selectedProgramStage !== null && selectedProgramStage !== undefined && selectedProgramStage !== '') {
        //     for (const tei of allTeis) {
        //         const marksResults: MarksQueryResults = await fetchMarks(tei, selectedProgramStage)
        //         marskEvents?.results?.instances?.push(...marksResults?.results?.instances)
        //     }
        // }

        console.log(allTeis, 4,  headerFieldsState)
        // const events2: EventQueryResults = await engine.query(EVENT_QUERY({
        //     ouMode: "DESCENDANTS",
        //     page,
        //     pageSize,
        //     // programStatus: "ACTIVE",
        //     program: program,
        //     order: "createdAt:desc",
        //     programStage: selectedProgramStage,
        //     filter: headerFieldsState?.dataElements,
        //     filterAttributes: headerFieldsState?.attributes,
        //     orgUnit: orgUnit as unknown as string
        // })).catch((error) => {
        //     show({
        //         message: `${("Could not get events")}: ${error.message}`,
        //         type: { critical: true }
        //     });
        //     setTimeout(hide, 5000);
        // }) as unknown as EventQueryResults;


        const programIndicatorsInstances = []

        if (selectedProgramIndicators?.length) {
            for (const tei of teiResults?.results?.instances) {
                const programIndicatorsResults = await getProgramIndicators(selectedProgramIndicators, orgUnit, program, formatAttributesFilter(tei.attributes))

                programIndicatorsInstances.push(returnTeiProgramIndicators(tei.trackedEntity, programIndicatorsResults))
            }
        }


        const localData = formatResponseRows({
            eventsInstances: events?.results?.instances,
            teiInstances: teiResults?.results?.instances,
            marksInstances: marskEvents?.results?.instances,
            programIndicatorsInstances: programIndicatorsInstances as any,
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
        loading,
        getMarks
    }
}
