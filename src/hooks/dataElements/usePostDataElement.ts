import { useDataMutation } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert';

const POST_DATA_ELEMENT: any = {
    resource: "tracker",
    type: 'create',
    data: ({ data }: any) => data,
    params: {
        async: false,
        importStrategy: 'UPDATE'
    }
}

export default function usePostDataElement() {
    const { hide, show } = useShowAlerts()

    const [create, { loading, data, error }] = useDataMutation(POST_DATA_ELEMENT, {
        onError: (error) => {
            show({
                message: `Could not save the marks: ${error.details.message}`,
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
