import { useState } from 'react'
import { useRecoilValue } from "recoil"
import { AllTeisSchema } from "../../schema/allTeisSchema"
import { useGetEvents } from "./useGetEvents"
import { getDataStoreKeys } from "../../utils"
import { SubTabState } from "../../schema/termMarksSchema"
import { useParams } from "../commons/useQueryParams"
import { useChangeEventStatus } from "./useChangeEventStatus"


export const useCompleteEvents = () => {
    const { getEvents } = useGetEvents()
    const { program } = getDataStoreKeys()
    const { urlParamiters } = useParams()
    const { school } = urlParamiters()
    const allTeis = useRecoilValue(AllTeisSchema)
    const selectedTerm = useRecoilValue(SubTabState)
    const { changeEventStatus } = useChangeEventStatus()
    const [loading, setLoading] = useState(false)

    async function completeEvents() {
        setLoading(true)
        const events: any[] = []

        for (const tei of allTeis) {
            await getEvents(1, 10, program, selectedTerm.programStage, [], [], school, tei)
                .then((resp) => {
                    events.push(...resp?.results?.instances)
                })
        }

        if (events?.length) {
            await changeEventStatus("COMPLETED", events)
                .catch(() => {
                    setLoading(false)

                })
        }

        setLoading(false)
    }

    return { completeEvents, loading }
}