import { useDataEngine } from "@dhis2/app-runtime";
import { EventQueryByTeiProps, EventQueryResults } from "../../types/api/WithoutRegistrationProps";

const EVENT_QUERY = (queryProps: EventQueryByTeiProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            ...queryProps
        }
    }
})

export function useGetEvent() {
    const engine = useDataEngine();

    async function getEvent(program: string, programStage: string, trackedEntity: string, orgUnit: string ) {
            return await engine.query(EVENT_QUERY({
                program,
                programStage,
                orgUnit,
                trackedEntity,
                ouMode: "DESCENDANTS"
            })) as unknown as EventQueryResults;
    }

    return { getEvent }
}
