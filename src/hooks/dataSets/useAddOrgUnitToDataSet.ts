import { useDataEngine } from "@dhis2/app-runtime";

const OU_TO_DATASET_QUERY: any = {
    resource: "metadata",
    type: "create",
    data: ({ data }: any) => data,
    params: {
        async: false
    }
};

const GET_DATASET: any = {
    results: {
        resource: "dataSets",
        id: ({ id }: any) => id,
        params: {
            fields: "*"
        }
    }
};


export default function useAddOrgUnitToDataSet () {
    const engine = useDataEngine()

    const addOuToDataSet = async (dataSets: (string | undefined)[], orgUnit: string) => {
        if (dataSets) {
            for (const dataSet of dataSets) {
             
                await engine.query(GET_DATASET, { variables: { id: dataSet } })

                    .then(async (dataSet: any) => {

                        dataSet?.results?.organisationUnits?.push({ id: orgUnit })

                        await engine.mutate(OU_TO_DATASET_QUERY, { variables: { data: { dataSets: [dataSet.results] } } })
                    })

            }
        }
    }
    return { addOuToDataSet }

}