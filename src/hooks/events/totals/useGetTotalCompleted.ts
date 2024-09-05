import { useParams } from "../../commons/useQueryParams";
import { useGetEvents } from "../useGetEvents";
import { getSelectedKey } from '../../../utils';

export function useGetTotalCompleted({ setTotals }: { setTotals: (args: any) => void }) {
    const { getEvents } = useGetEvents()
    const { getDataStoreData } = getSelectedKey()
    const { urlParamiters } = useParams()
    const { orgUnit, tab } = urlParamiters()

    async function getTotals() {
        let totals: any = {}
        const status = ['', 'COMPLETED']
        const selectedTabStage = getDataStoreData.assessment.tabGroups.find(x => x.label === tab)?.programStage as unknown as string

        for (const stage of status) {
            const response = await getEvents(1, 1, getDataStoreData.program, selectedTabStage, [], [], orgUnit, '', stage)
            totals[stage ? stage : 'Total'] = response?.results?.total
        }

        setTotals(totals)
    }

    async function getTotalToAllStage(){
        let totals: any = {}

        for (const stage of getDataStoreData.assessment.tabGroups) {
            const response = await getEvents(1, 1, getDataStoreData.program, stage.programStage, [], [], orgUnit, '', "")
            totals[stage.label] = response?.results?.total
        }

        setTotals(totals)
    }

    return { getTotals, getTotalToAllStage }
}