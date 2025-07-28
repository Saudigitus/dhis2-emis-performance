import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";
import { useGetNextActions } from "../programStages/useGetNextActions";
import { useParams } from "../commons/useQueryParams";

export function useHeader() {
    const { tableStatus } = useGetNextActions()
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { urlParamiters } = useParams()
    const { program } = urlParamiters()
    const programConfig = programConfigState?.find(x => x.id == program)

    return {
        columns: formatResponse(programConfig!, '', tableColumns, [], tableStatus)
    }
}
