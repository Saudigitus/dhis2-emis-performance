import { dataStoreRecord } from "../../../types/dataStore/DataStoreConfig"
import { HeadBarTypes, SelectedOptionsTypes } from "../../../types/headBar/HeadBarTypes"
import { programStageDataElements } from "../../../types/programStageConfig/ProgramStageConfig"
import { headBarDataElements } from "./headBarDataElements"

function headBarData(selectedOptions: SelectedOptionsTypes, dataStoreData: dataStoreRecord, programStageDataElements: programStageDataElements[]): HeadBarTypes[] {
    return [
        {
            id: "c540ac7c",
            label: "Unidade Organizacional",
            value: selectedOptions?.orgUnitName ?? "Selecione a unidade organizacional",
            placeholder: "Pesquisar por uma unidade Organizacional",
            component: "orgUnitTree",
            selected: Boolean(selectedOptions?.orgUnitName),
        },
        {
            disabled: !(selectedOptions?.orgUnit && selectedOptions?.orgUnitName),
            id: 'program',
            dataElementId:'program',
            label: 'Programa',
            value: programStageDataElements?.find((x: any) => x.value == selectedOptions.program)?.label ?? `Select a program`,
            placeholder: `Search for program`,
            component: "menuItemContainer",
            selected: Boolean(selectedOptions.program),
            options: programStageDataElements
        }

        // ...headBarDataElements(selectedOptions, dataStoreData, programStageDataElements)
    ]
}
export { headBarData }
