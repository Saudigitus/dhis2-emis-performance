import { useState } from "react";
import { getSelectedKey } from "../../utils"
import { useParams } from "../commons/useQueryParams"
import useShowAlerts from "../commons/useShowAlert"
import { useGetEvent } from "../events/useGetEvent"
import { dataValues } from "../../utils/table/rows/formatResponseRows";

export const useGetEventUpdateFormData = () => {
    const { getEvent } = useGetEvent()
    const { urlParamiters } = useParams()
    const { show } = useShowAlerts()
    const { orgUnit: orgUnit } = urlParamiters()
    const { getDataStoreData } = getSelectedKey()
    const [initialValues, setInitialValues] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    async function buildFormData(teiId: string, programStage: string) {
        setLoading(true)
        await getEvent(getDataStoreData.program, programStage, teiId, orgUnit!)
            .then((event) => {
                setInitialValues({
                    ...dataValues(event?.results?.instances?.[0]?.dataValues ?? []),
                    event: event?.results?.instances?.[0]?.event
                })
            })
            .catch((error) => {
                setError(true)
                show({
                    message: `${("Could not get selected enrollment details")}: ${error.message}`,
                    type: { critical: true }
                });
            })
            .finally(() => {
                setLoading(false)
            });


    }

    return {
        buildFormData,
        loading,
        error,
        initialValues,
        setInitialValues
    }
}