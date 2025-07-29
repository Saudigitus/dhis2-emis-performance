import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { EventsState } from "../../schema/termMarksSchema";
import { type TableDataProps, type EventQueryProps, type TeiQueryProps, type MarksQueryResults, type EventQueryResults, type TeiQueryResults } from "../../types/table/TableData";
import { formatResponseRows, getDataStoreKeys } from "../../utils";
import { useGetProgramIndicators } from "../programIndicators/useGetProgramIndicators";
import { formatAttributesFilter } from "../../utils/tei/formatAttributesFilter";
import { returnTeiProgramIndicators } from "../../utils/tei/returnTeiProgramIndicators";
import { AllTeisSchema } from "../../schema/allTeisSchema";
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
    const { hide, show } = useShowAlerts()
    const [_, setAllTeis] = useRecoilState(AllTeisSchema)
    const { assessment } = getDataStoreKeys()
    const [, setAllEvents] = useRecoilState(EventsState);
    const { orgUnit } = urlParamiters()
    const { getProgramIndicators } = useGetProgramIndicators()
    const { getEvents } = useGetEvents()
    const { tableStatus = [] } = useGetNextActions()

    async function getData(page: number, pageSize: number, selectedProgramStage: string, selectedProgramIndicators: string[], program: string) {
        setLoading(true)
        setAllEvents([])

        const events: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: "DESCENDANTS",
            page,
            pageSize,
            program: program,
            order: "createdAt:desc",
            programStage: selectedProgramStage,
            // filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: orgUnit as unknown as string,
        })).catch((error) => {
            show({
                message: `${("Could not get events")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as EventQueryResults;

        const formatedEvents = events?.results?.instances ?? events?.results?.events
        const allTeis = formatedEvents.map((x: { trackedEntity: string }) => x.trackedEntity)
        setAllTeis(allTeis)
        const trackedEntityToFetch = formatedEvents.map((x: { trackedEntity: string }) => x.trackedEntity).toString().replaceAll(",", ";")

        let teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                ouMode: orgUnit != null ? "SELECTED" : "ACCESSIBLE",
                pageSize,
                program: program,
                trackedEntity: trackedEntityToFetch,
                orgUnit: orgUnit!
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

        const theResults: any = teiResults?.results?.instances ?? teiResults?.results?.trackedEntities
        // if (theResults) {
        //     let counter = 0
        //     for (const tei of theResults) {
        //         const attId = assessment?.programs?.find(x => x?.program === tei.enrollments[0]?.program)?.attributes?.find(x => x.attributeName == 'parentId')?.attribute
        //         const ouId = tei?.attributes?.find((x: any) => x.attribute === attId)?.value

        //         if (ouId) {
        //             const teiName: any = await getOrgUnitCode(ouId as unknown as string, true)
        //             theResults[counter].attributes.map((x: any) => {
        //                 if (x.attribute === attId) x.value = teiName?.results?.name
        //             })
        //         }
        //         counter++
        //     }
        // }

        const promises = []
        const nextPstageEvents: any = {
            results: []
        }

        for (const action of tableStatus) {
            for (const tei of allTeis) {
                promises.push(getEvents(1, 1, program, action.programStage, [], [], orgUnit, tei))
            }
        }

        await Promise.all(promises)
            .then((responses: any) => {
                for (const response of responses) {
                    const formatedResp = response?.results?.instances ?? response?.results?.events
                    if (formatedResp.length)
                        nextPstageEvents.results.push(formatedResp[0])
                }
            })

        if (selectedProgramStage !== null && selectedProgramStage !== undefined && selectedProgramStage !== '') {
            const stage = assessment?.programs?.find(x => x?.program == program)?.registration
            for (const tei of allTeis) {
                const registration: any = await engine.query(EVENT_QUERY({
                    page,
                    pageSize,
                    program: program,
                    order: "createdAt:desc",
                    programStage: stage!,
                    filterAttributes: headerFieldsState?.attributes,
                    orgUnit: orgUnit as unknown as string,
                    trackedEntity: tei
                }))
                const data = registration?.results?.instances ?? registration?.results?.events
                marskEvents?.results?.instances?.push(...data)
            }
        }

        const programIndicatorsInstances = []

        if (selectedProgramIndicators?.length) {
            for (const tei of theResults) {
                const programIndicatorsResults = await getProgramIndicators(selectedProgramIndicators, orgUnit, program, formatAttributesFilter(tei.attributes))

                programIndicatorsInstances.push(returnTeiProgramIndicators(tei.trackedEntity, programIndicatorsResults))
            }
        }

        const localData = formatResponseRows({
            eventsInstances: formatedEvents ?? [],
            teiInstances: theResults,
            marksInstances: marskEvents?.results?.instances,
            programIndicatorsInstances: programIndicatorsInstances as any,
            programStage: selectedProgramStage,
            nextPstageEvents: teiHasEvents(tableStatus as unknown as any, nextPstageEvents.results, allTeis)
        })

        console.log(localData)
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
