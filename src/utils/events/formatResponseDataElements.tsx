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
                : dataElement?.valueType as unknown as CustomAttributeProps["valueType"],
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

export function formEvents(executionDateLabel = "Data do Evento") {
    return [{
        displayName: "Informação básica",
        fields: [
            {
                required: true,
                name: "eventDate",
                labelName: executionDateLabel,
                valueType: Attribute.valueType.DATE as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: undefined },
                initialOptions: { optionSet: undefined },
                disabled: false,
                pattern: "",
                visible: true,
                description: executionDateLabel,
                searchable: false,
                error: false,
                programStage: "programStageObject.id",
                content: "",
                id: "eventDate",
                displayName: executionDateLabel,
                header: executionDateLabel,
                type: VariablesTypes.DataElement,
                assignedValue: undefined
            }
        ]
    }]
}