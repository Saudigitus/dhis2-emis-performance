import { useDataEngine } from "@dhis2/app-runtime";

const OU_TO_PROGRAM_QUERY: any = {
    resource: "metadata",
    type: "create",
    data: ({ data }: any) => data,
    params: {
        async: false
    }
};

const GET_PROGRAM: any = {
    results: {
        resource: "programs",
        id: ({ id }: any) => id,
        params: {
            fields: "*"
        }
    }
};

export default function useAddOrgUnitToProgram() {
    const engine = useDataEngine()

    const addOuToProgram = async (programs: (string | undefined)[] | undefined, orgUnit: string) => {
        if (programs) {
            for (const program of programs) {
                await engine.query(GET_PROGRAM, { variables: { id: program } })

                    .then(async (programResult: any) => {

                        programResult?.results?.organisationUnits?.push({ id: orgUnit })

                        await engine.mutate(OU_TO_PROGRAM_QUERY, { variables: { data: { programs: [programResult.results] } } })
                    })

            }
        }
    }
    return { addOuToProgram }
}