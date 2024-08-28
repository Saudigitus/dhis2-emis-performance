import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";

const PROGRAM_INDICATORS_QUERY = (queryProps: any, program: string) => ({
    results: {
        id: program,
        resource: "analytics/enrollments/query",
        params: {
            ...queryProps
        }
    }
})

export const useGetProgramIndicators = () => {
    const engine = useDataEngine()
    const { hide, show } = useShowAlerts()

    const getProgramIndicators = async (programIndicators: string[], orgUnit: any, program: string, filter: any[]) => {
        return await engine.query(PROGRAM_INDICATORS_QUERY({
            dimension: `ou:${orgUnit},${programIndicators.join(",")}`,
            headers: `ouname,${programIndicators.join(",")}`,
            totalPages: false,
            filter: filter,
            displayProperty: 'NAME',
            outputType: 'ENROLLMENT',
            includeMetadataDetails: true
        },
            program)).catch((error) => {
                show({
                    message: `${("Could not get marks")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }) as unknown as any;
    }

    return { getProgramIndicators }
}

