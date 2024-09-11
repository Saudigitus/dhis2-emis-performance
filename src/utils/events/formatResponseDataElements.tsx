import { Attribute } from "../../types/generated/models";
import { ProgramStageSectionConfig } from "../../types/programStageConfig/ProgramStageConfig";
import { CustomAttributeProps, VariablesTypes } from "../../types/variables/AttributeColumns";

export function formatResponseDataElements(programStageObject: ProgramStageSectionConfig["dataElements"]): CustomAttributeProps[] {
    if (!programStageObject) return [];

    return programStageObject.map(dataElement => (
        {
            required: false,
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
    return [
        {
            displayName: "Informação básica",
            fields: [
                {
                    required: true,
                    name: "event_date",
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
                    id: "event_date",
                    displayName: executionDateLabel,
                    header: executionDateLabel,
                    type: VariablesTypes.DataElement,
                    assignedValue: undefined
                }
            ]
        },
        {
            displayName: "Detalhes do grupo",
            fields: [
                {
                    required: false,
                    name: "nomeAsca",
                    labelName: "Nome da ASCA",
                    valueType: Attribute.valueType.TEXT as unknown as CustomAttributeProps["valueType"],
                    options: { optionSet: undefined },
                    initialOptions: { optionSet: undefined },
                    disabled: true,
                    pattern: "",
                    visible: true,
                    description: "Nome da ASCA",
                    searchable: false,
                    error: false,
                    programStage: "programStageObject.id",
                    content: "",
                    id: "nomeAsca",
                    displayName: "Nome da ASCA",
                    header: "Nome da ASCA",
                    type: VariablesTypes.DataElement,
                    assignedValue: undefined
                }
            ]
        },
    ]
}