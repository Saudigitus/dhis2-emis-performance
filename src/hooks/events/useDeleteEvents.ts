import { useDataEngine } from "@dhis2/app-runtime";
import { useState } from 'react'
import useShowAlerts from "../commons/useShowAlert";
import { useRecoilState } from "recoil";
import { TeiRefetch } from "../../schema/refecthTeiSchema";
import { ConfirmationState } from "../../schema/confirmationDialog";

const ENROLLMENT_MUTATION: any = {
    resource: "tracker",
    type: 'create',
    data: ({ data }: any) => data,
    params: {
        importStrategy: 'DELETE',
        async: false
    }
}

export function useDeleteEvent() {
    const engine = useDataEngine();
    const [loading, setLoading] = useState(false)
    const { hide, show } = useShowAlerts()
    const [refetch, setRefetch] = useRecoilState<boolean>(TeiRefetch)
    const [confirmState, setConfirmState] = useRecoilState(ConfirmationState)

    async function deleteEvent(event: string) {
        setConfirmState((cd) => ({ ...cd, loading: true, open: false }))
        engine.mutate(ENROLLMENT_MUTATION, { variables: { data: { events: [{ event: event }] } } }).then(() => {
            setRefetch(!refetch)
        }).catch((error) => {
            show({
                message: `Could not save the data details: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
            setConfirmState((cd) => ({ ...cd, loading: false, open: false }))
        })
    }

    return { deleteEvent, loading }
}