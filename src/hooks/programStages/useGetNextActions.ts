import { useRecoilValue } from "recoil"
import { TabsState } from "../../schema/tabSchema"
import { ProgramConfigState } from "../../schema/programSchema"
import { useParams } from "../commons/useQueryParams"
import { TabListSchema } from "../../schema/tabListSchemma"

export const useGetNextActions = () => {
    const selectedTab = useRecoilValue(TabsState)
    const { urlParamiters } = useParams()
    const { program, tab } = urlParamiters()
    const programConfig = useRecoilValue(ProgramConfigState)
    const tabList = useRecoilValue(TabListSchema)

    const tableStatus = programConfig?.find(x => x.id == program)?.programStages?.filter((x: any) => !x.repeatable).map((x) => { return { columnName: x.displayName, programStage: x.id } })
    const currentProgramStage = programConfig?.find(x => x.id == program)?.programStages.find(x => x.id == selectedTab?.programStage)?.id

    const index = tabList.findIndex(x => x.programStage == tab)
    const copy = [...tabList]
    const _ = copy.splice(0, index + 1)

    const nextAction = copy?.map((x) => {
        return {
            columnName: x.name,
            displayName: `Efectuar ${x.name}`,
            programStage: x.programStage
        }
    })

    return { nextAction, tableStatus, currentProgramStage }
}