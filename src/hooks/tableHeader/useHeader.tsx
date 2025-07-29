import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse, getDataStoreKeys } from "../../utils";
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
    const { assessment } = getDataStoreKeys()
    const registration =assessment?.programs?.find(x => x?.program == program)?.registration

    return {
        columns: formatResponse(programConfig!, registration!, tableColumns, [], tableStatus as unknown as any)
    }
}
