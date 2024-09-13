import { nextProgramStageType } from "../../../types/dataStore/DataStoreConfig";
import { Attribute } from "../../../types/generated/models";
import { type ProgramConfig } from "../../../types/programConfig/ProgramConfig";
import { VariablesTypes, type CustomAttributeProps } from "../../../types/variables/AttributeColumns";
import { useMemo } from "react";


export function formatResponse(data: ProgramConfig, programStageId: string, tableColumns: CustomAttributeProps[] = [], programIndicators: any[], nextProgramStages: nextProgramStageType[], programStage?: any): CustomAttributeProps[] {
    let columns = [
        { label: 'Total de Financiamentos', id: 'totalFinancimanetos' },
        { label: 'Valor Total Recebido', id: 'totalRecebido' },
        { label: 'Acções', id: 'actions' }
    ]

    const originalData = ((data?.programStages?.find(programStge => programStge.id === programStageId)) ?? programStage ?? {}) as unknown as ProgramConfig["programStages"][0]
    const programIndicatorsData = data?.programIndicators?.filter((x) => programIndicators?.map((x) => x.id).join(",").includes(x.id))

    function getProgramStageDataElement(): [] {
        return Object.keys(originalData).length > 0
            ? originalData?.programStageDataElements?.map((programStageDataElement) => {
                return {
                    id: programStageDataElement.dataElement.id + "_" + programStageId,
                    rawId: programStageDataElement.dataElement.id,
                    displayName: programStageDataElement.dataElement.formName,
                    header: programStageDataElement.dataElement.formName,
                    required: programStageDataElement.compulsory,
                    name: programStageDataElement.dataElement.formName,
                    labelName: programStageDataElement.dataElement.formName,
                    valueType: programStageDataElement.dataElement.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : programStageDataElement.dataElement.valueType as unknown as CustomAttributeProps["valueType"],
                    options: { optionSet: programStageDataElement.dataElement.optionSet },
                    initialOptions: { optionSet: programStageDataElement.dataElement.optionSet },
                    visible: programStageDataElement.displayInReports,
                    disabled: false,
                    pattern: '',
                    searchable: false,
                    error: false,
                    content: '',
                    key: programStageDataElement.dataElement.id + "_" + programStageId,
                    type: VariablesTypes.Performance
                }
            }) as []
            : []
    }

    function getProgramIndicatorsHeaders(): [] {
        return programIndicatorsData?.map((programIndicator) => {
            return {
                id: programIndicator.id,
                rawId: programIndicator.id,
                displayName: programIndicator.displayName,
                header: programIndicator.displayName,
                required: false,
                name: programIndicator.displayName,
                labelName: programIndicator.displayName,
                valueType: Attribute.valueType.NUMBER as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: {} },
                initialOptions: { optionSet: {} },
                visible: true,
                disabled: false,
                pattern: '',
                searchable: false,
                error: false,
                content: '',
                key: programIndicator.id + "_" + programStageId,
                type: VariablesTypes.Performance
            }
        }) as []
    }

    function getNextProgramStagesColumns(): [] {
        return nextProgramStages?.map((nextProgramStage) => {
            return {
                id: nextProgramStage.programStage,
                rawId: nextProgramStage.programStage,
                displayName: nextProgramStage.columnName,
                header: nextProgramStage.columnName,
                required: false,
                name: nextProgramStage.columnName,
                labelName: nextProgramStage.columnName,
                valueType: '',
                options: { optionSet: {} },
                initialOptions: { optionSet: {} },
                visible: true,
                disabled: false,
                pattern: '',
                searchable: false,
                error: false,
                content: '',
                key: nextProgramStage.programStage + "_" + programStageId,
                displayInFilters: false,
                type: VariablesTypes.HasEvent
            }
        }) as []
    }


    function getHeaders() {
        let performanceHeaders = getProgramStageDataElement()
        let containsAllPerformance = performanceHeaders.every((performanceHeader: any) => tableColumns.find(customizedHeaders => customizedHeaders.id == performanceHeader.id));

        if (containsAllPerformance) return tableColumns
        else return tableColumns.concat(getProgramStageDataElement())
    }

    const headerResponse = useMemo(() => {

        return (tableColumns?.length > 0) ? getHeaders() : data?.programTrackedEntityAttributes?.map((item) => {
            return {
                id: item.trackedEntityAttribute.id,
                rawId: item.trackedEntityAttribute.id,
                displayName: item.trackedEntityAttribute.displayName,
                header: item.trackedEntityAttribute.displayName,
                required: item.mandatory,
                name: item.trackedEntityAttribute.displayName,
                labelName: item.trackedEntityAttribute.displayName,
                valueType: item.trackedEntityAttribute.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : item.trackedEntityAttribute.valueType as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: item.trackedEntityAttribute.optionSet },
                initialOptions: { optionSet: item.trackedEntityAttribute.optionSet },
                visible: item.displayInList,
                disabled: false,
                pattern: '',
                searchable: false,
                error: false,
                content: '',
                key: item.trackedEntityAttribute.id,
                type: VariablesTypes.Attribute
            }
        })
            .concat(getProgramStageDataElement())
            // .concat(getProgramIndicatorsHeaders())
            // .concat(getNextProgramStagesColumns())
            .concat(
                columns?.map((column) => {
                    return {
                        id: column.id,
                        rawId: column.id,
                        displayName: column.label,
                        header: column.label,
                        required: false,
                        name: column.id,
                        labelName: column.label,
                        valueType: '',
                        options: undefined,
                        initialOptions: undefined,
                        visible: true,
                        disabled: false,
                        pattern: '',
                        searchable: false,
                        error: false,
                        content: '',
                        key: column.id,
                        displayInFilters: false,
                        type: VariablesTypes.Custom
                    }
                }) as []
            )
    }, [data, programStageId, tableColumns, programIndicators]);

    return headerResponse;
}
