import { useParams } from "../../commons/useQueryParams";
import { useGetEvents } from "../useGetEvents";
import { getSelectedKey } from '../../../utils';

export function useGetTotalCompleted({ setTotals }: { setTotals: (args: any) => void }) {
    const { getEvents } = useGetEvents()
    const { getDataStoreData } = getSelectedKey()
    const { urlParamiters } = useParams()
    const { orgUnit } = urlParamiters()

    async function getTotals() {
        let totals: any = {}

        for (const stage of getDataStoreData.assessment.tabGroups) {
            const response = await getEvents(1, 1, getDataStoreData.program, stage.programStage, [], [], orgUnit, '', true)
            totals[stage.label] = response?.results?.total
        }

        setTotals(totals)
    }

    return { getTotals }
}