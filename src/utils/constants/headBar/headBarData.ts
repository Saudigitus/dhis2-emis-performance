import { dataStoreRecord } from "../../../types/dataStore/DataStoreConfig"
import { HeadBarTypes, SelectedOptionsTypes } from "../../../types/headBar/HeadBarTypes"
import { programStageDataElements } from "../../../types/programStageConfig/ProgramStageConfig"
import { headBarDataElements } from "./headBarDataElements"

function headBarData(selectedOptions: SelectedOptionsTypes, dataStoreData: dataStoreRecord, programStageDataElements: programStageDataElements[]): HeadBarTypes[] {
    return [
        {
            id: "c540ac7c",
            label: "School",
            value: selectedOptions?.schoolName ?? "Select a school",
            placeholder: "Search for organisation unit",
            component: "orgUnitTree",
            selected: Boolean(selectedOptions?.schoolName),
        },
        ...headBarDataElements(selectedOptions, dataStoreData, programStageDataElements)
    ]
}
export { headBarData }
