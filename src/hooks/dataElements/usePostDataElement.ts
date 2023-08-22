import { useDataMutation } from "@dhis2/app-runtime"

const POST_DATA_ELEMENT: any = {
    resource: "events",
    type: 'update',
    id: ({ id }: any) => id,
    data: ({ data }: any) => data
}

export default function usePostDataElement() {
    const [create, { loading, data, error }] = useDataMutation(POST_DATA_ELEMENT);

    return {
        loading,
        saveMarks: create,
        saved: data,
        error
    }
}
