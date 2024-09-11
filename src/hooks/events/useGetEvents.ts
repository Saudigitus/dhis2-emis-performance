import { useState } from 'react'
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from '../commons/useShowAlert';
import { EventsState } from '../../schema/termMarksSchema';
import { EventQueryProps } from "../../types/api/WithoutRegistrationProps";
import { useSetRecoilState } from 'recoil';
import { ConfirmationState } from '../../schema/confirmationDialog';

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
    const setAllEvents = useSetRecoilState(EventsState);
    const setConfirmState = useSetRecoilState(ConfirmationState)
    const [data, setData] = useState([])
    const [loadingMonitoriaEvents, setLoading] = useState(false)

    const getEvents = async (page: number, pageSize: number, program: string, programStage: string, filter: any[], filterAttributes: any[], orgUnit: any, paging = false) => {
        setLoading(true)
        return await engine.query(EVENT_QUERY({
            page,
            paging,
            pageSize,
            filter: filter,
            program: program,
            totalPages: true,
            ouMode: "DESCENDANTS",
            order: "createdAt:desc",
            programStage: programStage,
            filterAttributes: filterAttributes,
            orgUnit: orgUnit as unknown as string,
        })).then((resp: any) => {
            setData(resp.results.instances)
            setAllEvents(resp.results.instances)
            setConfirmState((cd) => ({ ...cd, loading: false, open: false, loadingComplete: false }))
            setLoading(false)
            return resp
        })
            .catch((error) => {
                setLoading(false)
                show({
                    message: `${("Could not get events")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
    }

    return { getEvents, events: data, loadingMonitoriaEvents }
}
