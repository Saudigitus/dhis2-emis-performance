import { useState } from 'react'
import { getDataStoreKeys } from '../../utils';
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from '../commons/useShowAlert';
import { useParams } from "../commons/useQueryParams";
import { useRecoilState, useRecoilValue } from "recoil";
import { EventsState } from '../../schema/termMarksSchema';
import { HeaderFieldsState } from "../../schema/headersSchema";
import { EventQueryProps, EventQueryResults } from "../../types/api/WithoutRegistrationProps";

const EVENT_QUERY = (queryProps: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            fields: "*",
            ...queryProps
        }
    }
})

export function useGetEvents() {
    const engine = useDataEngine();
    const { hide, show } = useShowAlerts()
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>([])

    const getEvents = async (page: number, pageSize: number, program: string, programStage: string, filter: any[], filterAttributes: any[], orgUnit: any, trackedEntity?: string, status?: string): Promise<EventQueryResults> => {
        setLoading(true)
        return await engine.query(EVENT_QUERY({
            totalPages: true,
            ouMode: "DESCENDANTS",
            page,
            pageSize,
            program: program,
            order: "createdAt:desc",
            programStage: programStage,
            filter: filter,
            filterAttributes: filterAttributes,
            orgUnit: orgUnit as unknown as string,
            ...(trackedEntity ? { trackedEntity: trackedEntity } : null),
            ...(status ? { status: status } : null)

        })).then((resp: any) => {
            setData(resp?.results?.instances)
            setLoading(false)
            return resp?.results
        })
            .catch((error) => {
                show({
                    message: `${("Could not get events")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }) as unknown as EventQueryResults;
    }


    return { getEvents, loading, data }
}
