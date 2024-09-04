import { useState } from 'react'
import { useRecoilState, useRecoilValue } from "recoil"
import { useGetEvents } from "./useGetEvents"
import { getDataStoreKeys } from "../../utils"
import { useParams } from "../commons/useQueryParams"
import { useChangeEventStatus } from "./useChangeEventStatus"
import { TabsState } from '../../schema/tabSchema'
import { UpdatingEventState } from '../../schema/updateEventSchema'
import { TeiRefetch } from '../../schema/refecthTeiSchema'


export const useCompleteEvents = () => {
    const { getEvents } = useGetEvents()
    const { program } = getDataStoreKeys()
    const { urlParamiters } = useParams()
    const { orgUnit } = urlParamiters()
    const selectedTab = useRecoilValue(TabsState)
    const { changeEventStatus } = useChangeEventStatus()
    const [loading, setLoading] = useState(false)
    const [, setLoadingRow] = useRecoilState(UpdatingEventState)
    const [refetch, setRefetch] = useRecoilState<boolean>(TeiRefetch)

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
                .finally(() => {
                    setRefetch(!refetch)
                    setLoadingRow({ event: '', loading: false })
                    setLoading(false)
                })
        }

        setLoading(false)
        setLoadingRow({ event: '', loading: false })


    }

    return { completeEvents, loading }
}