import { useDataMutation } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";
import { useRecoilState, useSetRecoilState } from "recoil";
import { TeiRefetch } from "../../schema/refecthTeiSchema";

const putEvent: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ form }: any) => form,
    params: {
        async: false,
        atomicMode: "OBJECT",
        reportMode: "FULL",
        importStrategy: "UPDATE"
    }
}

const useUpdateEvent = ({ setOpen }: { setOpen: (args: boolean) => void }) => {
    const { hide, show } = useShowAlerts()
    const [refetch, setRefetch] = useRecoilState(TeiRefetch)

    const [update, { loading }] = useDataMutation(putEvent, {
        onComplete(data) {
            setOpen(false)
            setRefetch(!refetch)
            show({
                message: 'Dados actualizados com sucesso',
                type: { success: true }
            });
            setTimeout(hide, 5000);
        },
        onError(error) {
            show({
                message: `${("Ocorreu um erro ao actualizar dados")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        },
    })

    async function updateEvents(data: any) {
        return await update({ form: { events: data } })
    }

    return { updateEvents, loading }
}

export default useUpdateEvent
