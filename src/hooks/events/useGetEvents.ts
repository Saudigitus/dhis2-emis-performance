import { useState } from 'react'
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from '../commons/useShowAlert';
import { EventsState } from '../../schema/termMarksSchema';
import { EventQueryProps, EventQueryResults } from "../../types/api/WithoutRegistrationProps";
import { useSetRecoilState } from 'recoil';

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
    const setAllEvents = useSetRecoilState(EventsState);

    const getEvents = async (page: number, pageSize: number, program: string, programStage: string, filter: any[], filterAttributes: any[], orgUnit: any): Promise<EventQueryResults> => {
        setLoading(true)
        return await engine.query(EVENT_QUERY({
            ouMode: "DESCENDANTS",
            paging: false,
            program: program,
            order: "createdAt:desc",
            programStage: programStage,
            filter: filter,
            filterAttributes: filterAttributes,
            orgUnit: orgUnit as unknown as string,
        })).then((resp: any) => {
            setAllEvents(resp.results.instances)
        })
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
