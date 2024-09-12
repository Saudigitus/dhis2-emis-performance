import { useDataEngine, useDataMutation } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";

const DELETE_TRACKER: any = {
    resource: "trackedEntityInstances",
    type: "delete",
    id: ({ id }: any) => id,
    // params: {
    //     importStrategy: "DELETE",
    //     async: false
    // }
};


export default function useDeleteTracker() {
    const engine = useDataEngine();

    // const data = (id: string[]) => {
    //     return {
    //         trackedEntities: id?.map((x) => ({
    //             trackedEntity: x,
    //         }))
    //     }
    // }

    const deleteTracker = async (id: string) => {
        return await engine.mutate(DELETE_TRACKER, { variables: { id } })
        // return await engine.mutate(DELETE_TRACKER, { variables: { data: data([id]) } })
    }


    return { deleteTracker }

}