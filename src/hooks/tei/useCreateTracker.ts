import { useDataEngine } from "@dhis2/app-runtime";

const POST_TRACKER: any = {
    resource: "tracker",
    type: "create",
    data: ({ data }: any) => data,
    params: {
        async: false
    }

};

export default function useCreateTracker() {
    const engine = useDataEngine()

    const createTracker = async ({ data }: { data: any }) => {
        return await engine.mutate(POST_TRACKER, { variables: { data } })
    }

    return { createTracker }

}