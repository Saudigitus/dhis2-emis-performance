import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { TermMarksState } from "../../schema/termMarksSchema";
import { formatResponse } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";

export function useHeader() {
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);
    const termMarksState = useRecoilValue(TermMarksState)

    return {
        columns: formatResponse(programConfigState, termMarksState?.id, tableColumns)
    }
}
