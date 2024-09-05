import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";
import { useGetNextActions } from "../programStages/useGetNextActions";

export function useHeader() {
    const { nextAction } = useGetNextActions()
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);

    return {
        columns: formatResponse(programConfigState, '', tableColumns, [], nextAction)
    }
}
