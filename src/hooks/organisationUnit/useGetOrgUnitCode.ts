import { useState, useEffect } from 'react'
import { useDataEngine } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert'


const GET_OU_CODE_QUERY = {
    results: {
        fields: "code",
        id: ({ id }: any) => id,
        resource: "organisationUnits",
    }
}

export const useGetOrgUnitCode = (orgUnit: string) => {
    const engine = useDataEngine()
    const { show } = useShowAlerts()
    const [objects, setobjects] = useState<string>()
    const [loading, setloading] = useState<boolean>(false)

    const getOrgUnitCode = async (orgUnit: string) => {
        setloading(true)
        await engine.query(GET_OU_CODE_QUERY, {
            variables: { id: orgUnit },

            onComplete: ((resp: { results: { code: string } }) => {
                setobjects(resp?.results?.code ? resp?.results?.code + Math.random().toString().substring(2, 7) : Math.random().toString().substring(2, 12))
                setloading(false)
            }),

            onError: (() => {
                setloading(false)
                show({ message: "Erro inesperado", type: { critical: true } })
            })
        })
    }


    useEffect(() => {
        getOrgUnitCode(orgUnit)
    }, [orgUnit])

    return { orgUnitCode: objects, loadingOrgUnitCode: loading }
}