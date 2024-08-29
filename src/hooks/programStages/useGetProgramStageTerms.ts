import { useRecoilValue } from "recoil";
import { getDataStoreKeys } from "../../utils";
import { TabsState } from "../../schema/tabSchema";

const useGetProgramStageTerms = () => {
  const { assessment } = getDataStoreKeys()
  const tabsState = useRecoilValue(TabsState)

  const items: any[] = assessment.tabGroups?.find((x) => x.label == tabsState.value)?.tabs.map(x => {
    return {
      id: x.label,
      label: x.label,
      programStage: x.programStage,
      programIndicators: x.programIndicators,
      hasProgramStage: Boolean(x.programStage)
    }
  })
    ?? [];



  return { items }
}
export default useGetProgramStageTerms
