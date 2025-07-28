import { useRecoilValue } from "recoil";
import { TabElementsProps } from "../../types/tabs/TabsTypes";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys";
import { ProgramConfigState } from "../../schema/programSchema";
import { useParams } from "../../hooks";

function useGetTabsElements() {
    const { assessment } = getDataStoreKeys()
    const { urlParamiters } = useParams()
    const { program } = urlParamiters()
    const programConfig = useRecoilValue(ProgramConfigState)?.find(x => x.id == program)

    const tabsElements: TabElementsProps[] = programConfig?.programStages?.filter(x => !x.repeatable)?.map((option, i) => ({
        order: i,
        name: option.displayName,
        value: option.id,
        programStage: option.id
    })) ?? []


    return { tabsElements }
}

export { useGetTabsElements }