import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { SubTabState } from "../../schema/termMarksSchema";
import { formatResponse, getSelectedKey } from "../../utils";
import { TableColumnState } from "../../schema/columnSchema";
import { useParams } from "../commons/useQueryParams";

export function useHeader() {
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { getDataStoreData } = getSelectedKey()
    const { urlParamiters } = useParams();
    const { moduloAdministrativo } = urlParamiters()

    return {
        columns: formatResponse(programConfigState, getDataStoreData.monitoria.programStage, tableColumns, [], moduloAdministrativo as unknown as string, getDataStoreData.monitoria.filters.dataElements[0].dataElement)
    }
}
