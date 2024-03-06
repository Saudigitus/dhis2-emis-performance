import { simpleProgramStage } from "../../types/dataStore/DataStoreConfig";
import { getDataStoreKeys } from "../../utils";

const useGetUsedPProgramStages = () => {
    const { performance, finalResult } = getDataStoreKeys();
    const performanceProgramStages = performance?.programStages.map(programStage => programStage.programStage) as unknown as simpleProgramStage[];
    return [...performanceProgramStages, finalResult?.programStage]
}
export default useGetUsedPProgramStages
