import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { SubTabState } from "../../schema/termMarksSchema";
import { formatResponse } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";

export function useHeader() {
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);
  
    return {
        columns: formatResponse(programConfigState, '', tableColumns, [])
    }
}
