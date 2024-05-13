import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { EventsState, TermMarksState } from "../../schema/termMarksSchema";
import { type TableDataProps, type EventQueryProps, type TeiQueryProps, type MarksQueryResults, type EventQueryResults, type TeiQueryResults } from "../../types/table/TableData";
import { formatResponseRowsMarks, formatResponseRows, getDataStoreKeys } from "../../utils";
import { TermMarksConfig } from "../../types/terms/TermMarksConfig";

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
    const [allTeis, setAllTeis] = useState<any[]>([])
    const { program, registration } = getDataStoreKeys()
    const [, setAllEvents] = useRecoilState(EventsState);
    const { school } = urlParamiters()

    const fetchMarks = async (tei: string,selectedTermId:string) => {
        return await engine.query(EVENT_QUERY({
            //ouMode: "SELECTED",
            // programStatus: "ACTIVE",
            program: program,
            order: "createdAt:desc",
            programStage: selectedTermId,
            //orgUnit: school as unknown as string,
            trackedEntity: tei
        })).catch((error) => {
            show({
                message: `${("Could not get marks")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as MarksQueryResults;
    }

    const getMarks = async (selectedTerm: TermMarksConfig) => {
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
            const marksResults: MarksQueryResults = await fetchMarks(tei,selectedTerm.id)
            marskEvents.results.instances.push(...marksResults?.results?.instances)
        }

        for (let i = 0; i < localData.length; i++) {
            const marksDetails = marskEvents?.results?.instances?.find((event: any) => (event.trackedEntity === localData[i]?.trackedEntity) && (event?.enrollment === localData[i]?.enrollment));
            if (marksDetails !== undefined) {
                localData[i] = { ...localData[i], ...formatResponseRowsMarks({ marksInstance: marksDetails, programStage: selectedTerm?.id }) }
            }
        }

        for (const row of localData) {
            setAllEvents((prev) => [...prev, marskEvents.results.instances.find((event: any) => (event.trackedEntity === row.trackedEntity) && (event.enrollment === row.enrollment))])
        }

        setTableData(localData);
        setLoading(false)
    }

    async function getData(page: number, pageSize: number, selectedTerm: TermMarksConfig) {
        setLoading(true)
        setAllEvents([])
        setImmutableTeiData([])

        const events: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: "SELECTED",
            page,
            pageSize,
            // programStatus: "ACTIVE",
            program: program,
            order: "createdAt:desc",
            programStage: registration?.programStage,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: school as unknown as string
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
                // ouMode: "SELECTED",
                // order: "created:desc",
                // pageSize,
                program: program,
                // orgUnit: school as unknown as string,
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

        if (selectedTerm.id !== null && selectedTerm.id !== undefined && selectedTerm.id !== '') {
            for (const tei of allTeis) {
                const marksResults: MarksQueryResults = await fetchMarks(tei,selectedTerm.id)
                marskEvents.results.instances.push(...marksResults?.results?.instances)
            }
        }

        const localData = formatResponseRows({
            eventsInstances: events?.results?.instances,
            teiInstances: teiResults?.results?.instances,
            marksInstances: marskEvents?.results?.instances,
            setImmutableTeiData,
            programStage: selectedTerm?.id
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
