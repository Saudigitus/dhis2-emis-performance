import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";
import { TabsState } from "../../schema/tabSchema";
import { DataStoreState } from "../../schema/dataStoreSchema";

export function useHeader() {
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);
    const selectedTab = useRecoilValue(TabsState)
    const dataStore = useRecoilValue(DataStoreState)
    const nextAction = dataStore[0].assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction as any
  
    return {
        columns: formatResponse(programConfigState, '', tableColumns, [], nextAction)
    }
}
