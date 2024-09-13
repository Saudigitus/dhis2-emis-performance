import { Attribute } from "../../types/generated/models";
import { programStageDataElements, ProgramStageSectionConfig } from "../../types/programStageConfig/ProgramStageConfig";
import { CustomAttributeProps, VariablesTypes } from "../../types/variables/AttributeColumns";

export function formatResponseDataElements(programStageObject: ProgramStageSectionConfig["dataElements"], dataElements: programStageDataElements[]): any[] {
    if (!programStageObject) return [];

    console.log(programStageObject, dataElements)

    return programStageObject.map(dataElement => (
        {
            required: dataElements.find(element => element.dataElement.id === dataElement.id)?.compulsory,
            name: dataElement.id,
            labelName: dataElements.find(element => element.dataElement.id === dataElement.id)?.dataElement.formName,
            valueType: dataElement?.optionSet
                ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"]
                : dataElement?.valueType as unknown as CustomAttributeProps["valueType"],
            options: { optionSet: dataElement?.optionSet },
            initialOptions: { optionSet: dataElement?.optionSet },
            disabled: false,
            pattern: "",
            visible: dataElements.find(element => element.dataElement.id === dataElement.id)?.displayInReports,
            description: dataElements.find(element => element.dataElement.id === dataElement.id)?.dataElement.formName,
            searchable: dataElement.displayInReports,
            error: false,
            programStage: "programStageObject.id",
            content: "",
            id: dataElement?.id,
            displayName: dataElements.find(element => element.dataElement.id === dataElement.id)?.dataElement.formName,
            header: dataElements.find(element => element.dataElement.id === dataElement.id)?.dataElement.formName,
            type: VariablesTypes.DataElement,
            value: undefined
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