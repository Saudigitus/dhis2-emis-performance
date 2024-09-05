import { useState } from 'react'
import { useRecoilValue } from "recoil"
import { AllTeisSchema } from "../../schema/allTeisSchema"
import { useGetEvents } from "./useGetEvents"
import { getDataStoreKeys } from "../../utils"
import { SubTabState } from "../../schema/termMarksSchema"
import { useParams } from "../commons/useQueryParams"
import { useChangeEventStatus } from "./useChangeEventStatus"
import { TabsState } from '../../schema/tabSchema'


export const useCompleteEvents = () => {
    const { getEvents } = useGetEvents()
    const { program } = getDataStoreKeys()
    const { urlParamiters } = useParams()
    const { orgUnit } = urlParamiters()
    const selectedTab = useRecoilValue(TabsState)
    const { changeEventStatus } = useChangeEventStatus()
    const [loading, setLoading] = useState(false)


    async function completeEvents(status: string, teisToUpdate: string[]) {
        setLoading(true)
        const events: any[] = []

        for (const tei of teisToUpdate) {
            await getEvents(1, 10, program, selectedTab.programStage, [], [], orgUnit, tei)
                .then((resp) => {
                    events.push(...resp?.results?.instances)
                })
        }

        if (events?.length) {
            await changeEventStatus(status, events)
                .catch(() => {
                    setLoading(false)

                })
        }

        setLoading(false)
    }

    return { completeEvents, loading }
}