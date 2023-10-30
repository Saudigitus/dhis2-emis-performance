/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { formatResponseRows, formatResponseRowsMarks } from "../../utils/table/rows/formatResponseRows";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { EventsState, TermMarksState } from "../../schema/termMarksSchema";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
import { type TableDataProps, type EventQueryProps, type TeiQueryProps, type MarksQueryResults, type EventQueryResults, type TeiQueryResults } from "../../types/table/TableData";

const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, trackedEntity, programStatus }: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            order,
            page,
            pageSize,
            ouMode,
            program,
            programStatus,
            programStage,
            orgUnit,
            filter,
            trackedEntity,
            filterAttributes,
            fields: "*"
        }
    }
})

const TEI_QUERY = ({ ouMode, pageSize, program, trackedEntity, orgUnit, order }: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            program,
            order,
            ouMode,
            pageSize,
            trackedEntity,
            orgUnit,
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt]"
        }
    }
})

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const [selectedTerm] = useRecoilState(TermMarksState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    //O immutable pega os attributos e os dataElements do registration
    const [immutableTeiData, setImmutableTeiData] = useState<any[]>([])
    const { hide, show } = useShowAlerts()
    const [allTeis, setAllTeis] = useState<any[]>([])
    const { getDataStoreData } = getSelectedKey()
    const [, setAllEvents] = useRecoilState(EventsState);
    const school = urlParamiters().school as unknown as string

    const getMarks = async () => {
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
            const marksResults: MarksQueryResults = await engine.query(EVENT_QUERY({
                ouMode: "SELECTED",
                programStatus: "ACTIVE",
                program: getDataStoreData?.program,
                order: "createdAt:desc",
                programStage: selectedTerm?.id,
                orgUnit: school,
                trackedEntity: tei
            })).catch((error) => {
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
            marskEvents.results.instances.push(...marksResults?.results?.instances)
        }

        for (let i = 0; i < localData.length; i++) {
            const marksDetails = marskEvents?.results?.instances?.find((event: any) => event.trackedEntity === localData[i]?.trackedEntity);
            if (marksDetails !== undefined) {
                localData[i] = { ...localData[i], ...formatResponseRowsMarks({ marksInstance: marksDetails }) }
            }
        }

        for (const row of localData) {
            setAllEvents((prev) => [...prev, marskEvents.results.instances.find((event: any) => event.trackedEntity === row.trackedEntity)])
        }
        setTableData(localData);
        setLoading(false)
    }

    async function getData(page: number, pageSize: number) {
        setLoading(true)
        setAllEvents([])
        setImmutableTeiData([])
        const events: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: "SELECTED",
            page,
            pageSize,
            programStatus: "ACTIVE",
            program: getDataStoreData?.program,
            order: "createdAt:desc",
            programStage: getDataStoreData?.registration?.programStage,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: school
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        })

        const allTeis = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity)
        setAllTeis(allTeis)
        const trackedEntityToFetch = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity).toString().replaceAll(",", ";")

        const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                ouMode: "SELECTED",
                order: "created:desc",
                pageSize,
                program: getDataStoreData?.program,
                orgUnit: school,
                trackedEntity: trackedEntityToFetch
            })).catch((error) => {
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
            : { results: { instances: [] } }

        const marskEvents: MarksQueryResults = {
            results: {
                instances: []
            }
        }

        if (selectedTerm?.id) {
            for (const tei of allTeis) {
                const marksResults: MarksQueryResults = await engine.query(EVENT_QUERY({
                    ouMode: "SELECTED",
                    programStatus: "ACTIVE",
                    program: getDataStoreData?.program,
                    order: "createdAt:desc",
                    programStage: selectedTerm?.id,
                    orgUnit: school,
                    trackedEntity: tei
                })).catch((error) => {
                    show({
                        message: `${("Could not get data")}: ${error.message}`,
                        type: { critical: true }
                    });
                    setTimeout(hide, 5000);
                })
                marskEvents.results.instances.push(...marksResults?.results?.instances)
            }
        }

        const localData = formatResponseRows({
            eventsInstances: events?.results?.instances,
            teiInstances: teiResults?.results?.instances,
            marksInstances: marskEvents?.results?.instances,
            setImmutableTeiData
        })

        for (const row of localData) {
            setAllEvents((prev) => [...prev, marskEvents.results.instances.find((event: any) => event.trackedEntity === row.trackedEntity)])
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
