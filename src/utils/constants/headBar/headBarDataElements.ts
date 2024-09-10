import { HeadBarTypes, SelectedOptionsTypes } from "../../../types/headBar/HeadBarTypes";
import { filterItem, dataStoreRecord } from "../../../types/dataStore/DataStoreConfig";
import { programStageDataElements } from "../../../types/programStageConfig/ProgramStageConfig";
import { formatCamelCaseToWords } from "../../commons/formatCamelCaseToWords";

export const headBarDataElements = (selectedOptions: SelectedOptionsTypes, getDataStoreData: dataStoreRecord, programStageDataElements: programStageDataElements[]): HeadBarTypes[] => {
    const headBarFilters: HeadBarTypes[] = []

    getDataStoreData?.monitoria?.filters?.dataElements.map((filter: filterItem) => {
        if (programStageDataElements) {
            let headBarFilterName: string = '';

            const dataElement = programStageDataElements?.find((psDataElement: any) => psDataElement?.dataElement?.id === filter?.dataElement)?.dataElement;

            const value = dataElement?.optionSet.options.find(x => x.value === selectedOptions[filter.code as unknown as keyof typeof selectedOptions])?.label
            if (dataElement) headBarFilterName = dataElement.formName;

            headBarFilters.push({
                disabled: !(selectedOptions?.orgUnit && selectedOptions?.orgUnitName),
                id: filter.code,
                label: headBarFilterName,
                value: value ?? `Select a ${formatCamelCaseToWords(filter.code)}`,
                placeholder: `Search for ${formatCamelCaseToWords(filter.code)}`,
                dataElementId: filter.dataElement,
                component: "menuItemContainer",
                selected: Boolean(selectedOptions[filter.code as unknown as keyof typeof selectedOptions]),
            })
        }

    })

    return headBarFilters
}
