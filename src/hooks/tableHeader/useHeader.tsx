import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";
import { useParams } from "../commons/useQueryParams";

export function useHeader() {
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { urlParamiters } = useParams();
    const { programStage } = urlParamiters()

    return {
        columns: formatResponse(programConfigState, programStage!, tableColumns)
    }
}
