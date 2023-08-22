import { useDataMutation } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert';

const POST_DATA_ELEMENT: any = {
    resource: "events",
    type: 'update',
    id: ({ id }: any) => id,
    data: ({ data }: any) => data
}

export default function usePostDataElement() {
    const { hide, show } = useShowAlerts()

    const [create, { loading, data, error }] = useDataMutation(POST_DATA_ELEMENT, {
        onError: (error) => {
            show({
                message: `Could not save the final result details: ${error.details.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }
    });

    return {
        loading,
        saveMarks: create,
        saved: data,
        error
    }
}
