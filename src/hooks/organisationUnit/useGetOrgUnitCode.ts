import { useState, useEffect } from 'react'
import { useDataEngine } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert'


const GET_OU_CODE_QUERY = {
    results: {
        params: {
            fields: "code,name",
        },
        id: ({ id }: any) => id,
        resource: "organisationUnits",
    }
}

export const useGetOrgUnitCode = (orgUnit?: string) => {
    const engine = useDataEngine()
    const { show } = useShowAlerts()
    const [objects, setobjects] = useState<string>()
    const [loading, setloading] = useState<boolean>(false)

    const getOrgUnitCode = async (orgUnit: string, updateSate = false) => {
        setloading(true)
        return await engine.query(GET_OU_CODE_QUERY, {
            variables: { id: orgUnit },

            onComplete: ((resp: { results: { code: string } }) => {
                setloading(false)
                if (!updateSate)
                    setobjects(resp?.results?.code ? resp?.results?.code + Math.random().toString().substring(2, 7) : Math.random().toString().substring(2, 12))
                else return resp?.results
            }),

            onError: (() => {
                setloading(false)
                show({ message: "Erro inesperado", type: { critical: true } })
            })
        })
    }


    useEffect(() => {
        getOrgUnitCode(orgUnit as unknown as string)
    }, [orgUnit])

    return { orgUnitCode: objects, loadingOrgUnitCode: loading, getOrgUnitCode }
}