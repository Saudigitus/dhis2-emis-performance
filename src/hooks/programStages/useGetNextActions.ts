import { useRecoilValue } from "recoil"
import { TabsState } from "../../schema/tabSchema"
import { DataStoreState } from "../../schema/dataStoreSchema"
import { nextProgramStageType } from "../../types/dataStore/DataStoreConfig"
import { ProgramConfigState } from "../../schema/programSchema"
import { useParams } from "../commons/useQueryParams"

export const useGetNextActions = () => {
    const selectedTab = useRecoilValue(TabsState)
    const dataStore = useRecoilValue(DataStoreState)
    const { urlParamiters } = useParams()
    const { program } = urlParamiters()
    const programConfig = useRecoilValue(ProgramConfigState)

    const tableStatus = programConfig?.find(x => x.id == program)?.programStages?.filter(x => !x.repeatable).map((x) => { return { columnName: x.displayName, programStage: x.id } })
    const currentProgramStage = programConfig?.find(x => x.id == program)?.programStages.find(x => x.id == selectedTab?.programStage)?.id
    const nextAction = dataStore[0]?.assessment?.tabGroups?.find((x) => x?.programStage == selectedTab?.programStage)?.nextAction as nextProgramStageType[]

    return { nextAction, tableStatus, currentProgramStage }
}