import { dataStoreRecord } from "../../../types/dataStore/DataStoreConfig"
import { HeadBarTypes, SelectedOptionsTypes } from "../../../types/headBar/HeadBarTypes"
import { programStageDataElements } from "../../../types/programStageConfig/ProgramStageConfig"
import { headBarDataElements } from "./headBarDataElements"

function headBarData(selectedOptions: SelectedOptionsTypes, dataStoreData: dataStoreRecord, programStageDataElements: programStageDataElements[]): HeadBarTypes[] {

    return [
        {
            id: "c540ac7c",
            label: "Unidade Organisacional",
            value: selectedOptions?.orgUnitName ?? "Selecione a Unidade Organisacional",
            placeholder: "Pesquise por uma Unidade Organisacional",
            component: "orgUnitTree",
            selected: Boolean(selectedOptions?.orgUnitName),
        },
        ...headBarDataElements(selectedOptions, dataStoreData, programStageDataElements)
    ]
}
export { headBarData }
