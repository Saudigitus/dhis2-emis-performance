import { useParams } from "../../commons/useQueryParams";
import { useGetEvents } from "../useGetEvents";
import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";

export function useGetTotalCompleted({ setTotals }: { setTotals: (args: any) => void }) {
    const { getEvents } = useGetEvents()
    const programconfig = useRecoilValue(ProgramConfigState)
    const { urlParamiters } = useParams()
    const { orgUnit, tab, program } = urlParamiters()

    async function getTotals() {
        let totals: any = {}
        const status = ['', 'COMPLETED']

        for (const stage of status) {
            const response: any = await getEvents(1, 1, program!, tab!, [], [], orgUnit, '', stage)
            totals[stage ? stage : 'Total'] = response?.results?.total
        }

        setTotals(() => totals)
    }

    async function getTotalToAllStage() {
        let totals: any = {}
        const programStages = programconfig?.find(x => x.id == program)?.programStages?.filter((x: any) => !x.repeatable) ?? []

        for (const stage of programStages!) {
            const response: any = await getEvents(1, 1, program!, stage.id, [], [], orgUnit, '', "")
            totals[stage.displayName] = response?.results?.total
        }

        setTotals(() => totals)
    }

    return { getTotals, getTotalToAllStage }
}