import { useRecoilValue } from "recoil"
import { TabsState } from "../../schema/tabSchema"
import { DataStoreState } from "../../schema/dataStoreSchema"
import { nextProgramStageType } from "../../types/dataStore/DataStoreConfig"

export const useGetNextActions = () => {
    const selectedTab = useRecoilValue(TabsState)
    const dataStore = useRecoilValue(DataStoreState)

    const tableStatus = dataStore[0]?.assessment.tableStatus
    const currentProgramStage = dataStore[0]?.assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.programStage
    const nextAction = dataStore[0]?.assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction as nextProgramStageType[]

    return { nextAction, tableStatus, currentProgramStage }
}