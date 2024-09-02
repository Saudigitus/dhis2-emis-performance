import { Attribute } from "../../types/generated/models";
import { ProgramStageSectionConfig } from "../../types/programStageConfig/ProgramStageConfig";
import { CustomAttributeProps, VariablesTypes } from "../../types/variables/AttributeColumns";

export function formatResponseDataElements(programStageObject: ProgramStageSectionConfig["dataElements"]): CustomAttributeProps[] {
    if (!programStageObject) return [];

    return programStageObject.map(dataElement => (
        {
            required: true,
            name: dataElement.id,
            labelName: dataElement.displayName,
            valueType: dataElement?.optionSet
                ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"]
                : dataElement?.valueType as unknown as  CustomAttributeProps["valueType"],
            options: { optionSet: dataElement?.optionSet },
            initialOptions: { optionSet: dataElement?.optionSet },
            disabled: false,
            pattern: "",
            visible: true,
            description: dataElement.displayName,
            searchable: dataElement.displayInReports,
            error: false,
            programStage: "programStageObject.id",
            content: "",
            id: dataElement?.id,
            displayName: dataElement?.displayName,
            header: dataElement?.displayName,
            type: VariablesTypes.DataElement,
            assignedValue: undefined
        }
    ));
}