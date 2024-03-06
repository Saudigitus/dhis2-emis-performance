import { useRecoilValue } from "recoil";
import { SimpleButtonsType } from "../../types/buttons/SimpleButtonsProps";
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys";
import { ProgramConfigState } from "../../schema/programSchema";

const useGetProgramStageTerms = () => {
  const programConfig = useRecoilValue(ProgramConfigState)
  const { performance } = getDataStoreKeys()

  const items: SimpleButtonsType[] = performance?.programStages.map(x => {
        return {
          id: x.programStage,
          label: programConfig?.programStages.find(pStage => pStage.id === x.programStage)?.displayName,
          type: "programStage"
        }
      }) ?? [];

    
    return { items }
}
export default useGetProgramStageTerms
