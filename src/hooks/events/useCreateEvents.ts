import { useRecoilState } from 'recoil';
import { useShowAlerts } from '../../hooks';
import { useDataMutation } from "@dhis2/app-runtime";
import { TeiRefetch } from '../../schema/refecthTeiSchema';

const POST_EVENT: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ data }: any) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        async: false
    }
}

export function usePostEvent() {
    const { hide, show } = useShowAlerts()
    const [refetch, setRefetch] = useRecoilState<boolean>(TeiRefetch)

    const [create, { loading, data }] = useDataMutation(POST_EVENT, {
        onComplete: () => {
            show({ message: "Operação realizada com sucesso", type: { success: true } })
            setRefetch(!refetch)
        },
        onError: (error) => {
            show({
                message: `Could not save the data details: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }
    });

    return {
        loadUpdateEvent: loading,
        updateEvent: create,
        data
    }
}
