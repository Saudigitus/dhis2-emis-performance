import { useDataEngine } from "@dhis2/app-runtime";
import { useState, useEffect } from "react"
import { useSetRecoilState } from "recoil";
import { DataSetPeriodState } from "../../schema/dataStoreSchema";

const resourceTypes = {
    results: {
        resource: "dataSets",
        id: (id : string) => "vzkyA4duKGM",
        params: {
            fields: "periodType,timelyDays"
        }
    }
}

export const useGetDataSets = () => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState<boolean>()
    const setDataSetPeriod = useSetRecoilState(DataSetPeriodState)

    useEffect(() => {
        const getDataSet = async () => {
            try {
                setLoading(true)
                const response = await engine.query(resourceTypes)
                setDataSetPeriod(response?.results)
            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getDataSet()
    }, [])

    return { loading: loading }
}