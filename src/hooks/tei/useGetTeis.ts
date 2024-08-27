import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { TeiQueryProps } from "../../types/table/TableData";
import { TeiQueryResults } from "../../types/api/WithRegistrationProps";


const TEI_QUERY = (queryProps: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            fields: "trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt]",
            ...queryProps
        }
    }
})

export function useGetTeis() {
    const engine = useDataEngine();
    const { hide, show } = useShowAlerts()

    const getTeis = async (orgUnit: any, pageSize: number, program: string, trackedEntity: any): Promise<TeiQueryResults> => {
        return await engine.query(TEI_QUERY({
            ouMode: orgUnit != null ? "SELECTED" : "ACCESSIBLE",
            pageSize,
            orgUnit: orgUnit,
            program: program,
            trackedEntity: trackedEntity
        })).catch((error) => {
            show({
                message: `${("Could not get tracked entities")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as TeiQueryResults
    }

    return { getTeis }
}