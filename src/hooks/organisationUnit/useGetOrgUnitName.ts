import { useState } from 'react'
import { useDataEngine } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert'

const GET_OU_CODE_QUERY = {
    results: {
        params: {
            fields: "name",
        },
        id: ({ id }: any) => id,
        resource: "organisationUnits",
    }
}

export const useGetOrgUnitName = () => {
    const engine = useDataEngine()
    const { show } = useShowAlerts()
    const [loading, setloading] = useState<boolean>(false)

    const getOrgUnitName = async (orgUnit: string) => {
        setloading(true)
        return await engine.query(GET_OU_CODE_QUERY, {
            variables: { id: orgUnit },

            onComplete: ((resp: { results: { code: string } }) => {
                setloading(false)
                return resp?.results
            }),

            onError: (() => {
                setloading(false)
                show({ message: "Erro inesperado", type: { critical: true } })
            })
        })
    }

    return { loading, getOrgUnitName }
}