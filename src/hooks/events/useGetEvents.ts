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

    const getEvents = async (page: number, pageSize: number, program: string, programStage: string, filter: any[], filterAttributes: any[], orgUnit: any, trackedEntity?: string): Promise<EventQueryResults> => {
        setLoading(true)
        return await engine.query(EVENT_QUERY({
            ouMode: "DESCENDANTS",
            page,
            pageSize,
            program: program,
            order: "createdAt:desc",
            programStage: programStage,
            filter: filter,
            filterAttributes: filterAttributes,
            orgUnit: orgUnit as unknown as string,
            ...( trackedEntity ? { trackedEntity: trackedEntity } : null)
        }))
            .catch((error) => {
                show({
                    message: `${("Could not get events")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }) as unknown as EventQueryResults;
    }


    return { getEvents, loading }
}
