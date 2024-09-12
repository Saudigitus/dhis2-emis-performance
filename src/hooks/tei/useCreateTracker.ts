import { useDataMutation } from "@dhis2/app-runtime";
import useShowAlerts from "../commons/useShowAlert";

const POST_EVENT : any = {
    resource: "tracker",
    type:"create",
    data: ({ data }: any) => data,
    params: {
        async: false
    }
    
};

export default function useCreateTracker () {
    const { hide, show } = useShowAlerts ()


    const [ create, { loading, data }] = useDataMutation (POST_EVENT, {
        onError: (error: any) => {
            show({
                message: `Erro ao registar grupo: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }
    });

    return { createTracker: create, loading, data}

}