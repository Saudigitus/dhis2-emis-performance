import { useRecoilValue } from "recoil";
import { TabElementsProps } from "../../types/tabs/TabsTypes";
import { ProgramConfigState } from "../../schema/programSchema";
import { useParams } from "../../hooks";

function useGetTabsElements() {
    const { urlParamiters } = useParams()
    const { program } = urlParamiters()
    const programConfig = useRecoilValue(ProgramConfigState)?.find(x => x.id == program)

    const tabsElements: TabElementsProps[] = programConfig?.programStages?.filter((x: any) => !x.repeatable)?.map((option, i) => ({
        name: option.displayName,
        value: option.id,
        programStage: option.id
    })) ?? []


    return { tabsElements }
}

export { useGetTabsElements }