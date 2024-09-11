import { getSelectedKey } from "../../utils";
import { useParams } from "../commons/useQueryParams";
import { useGetEvents } from '../events/useGetEvents';

export function useGtTotals({ setTotals }: { setTotals: (args: any) => void }) {
    const { getEvents } = useGetEvents()
    const { getDataStoreData } = getSelectedKey()
    const { urlParamiters } = useParams()
    const { orgUnit, moduloAdministrativo } = urlParamiters()

    async function getTotals() {
        let totals: any = {}
        const status = [
            { label: "grupos", pStage: getDataStoreData.registration.programStage, filter: [] },
            { label: "formados", pStage: getDataStoreData.monitoria.programStage, filter: [`${getDataStoreData.monitoria?.filters?.dataElements[0].dataElement}:in:${moduloAdministrativo}`] }
        ]

        for (const stage of status) {
            const response = await getEvents(1, 1, getDataStoreData.program, stage.pStage, stage.filter, [], orgUnit, true)
            totals[stage.label] = response?.results?.total
        }

        setTotals(totals)
    }

    return { getTotals }
}