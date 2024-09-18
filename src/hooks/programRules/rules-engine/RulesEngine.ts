import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { OptionGroupsConfigState } from "../../../schema/optionGroupsSchema";
import { OrgUnitsGroupsConfigState } from "../../../schema/orgUnitsGroupSchema";
import { compareStringByLabel } from "../../../utils/commons/sortStringsByLabel";
import { ProgramRulesFormatedState } from "../../../schema/programRulesFormated";

interface RulesEngineProps {
    variables: any[]
    values: Record<string, any>
    type: "programStage" | "programStageSection" | "attributesSection"
    formatKeyValueType?: any
}

export const CustomDhis2RulesEngine = (props: RulesEngineProps) => {
    const { variables = [], values, type, formatKeyValueType } = props
    const getOptionGroups = useRecoilValue(OptionGroupsConfigState)
    const newProgramRules = useRecoilValue(ProgramRulesFormatedState)
    const [updatedVariables, setupdatedVariables] = useState<any>([])
    const orgUnitsGroups = useRecoilValue(OrgUnitsGroupsConfigState)

    useEffect(() => {
        if (updatedVariables.length === 0) {
            setupdatedVariables([...variables])
        }
    }, [variables])

    function runRulesEngine(data?: any[]) {
        if (type === "programStageSection") rulesEngineSections(data)
        else if (type === "programStage") rulesEngineDataElements(data)
        else if (type === "attributesSection") rulesEngineAttributesSections(data)
    }

    // rules engine function for attributes/programSections
    function rulesEngineAttributesSections(data: any[] = []) {
        const localVariablesSections = data?.length > 0 ? data : [...updatedVariables]
        const updatedVariablesCopy = localVariablesSections?.map(section => {
            const updatedSection = { ...section };
            updatedSection.variable = section?.variable?.map((variable: any) => {
                return applyRulesToVariable(variable);
            });
            return updatedSection;
        });
        setupdatedVariables(updatedVariablesCopy)
    }

    // rules engine function for programStageSections
    function rulesEngineSections(data: any[] = []) {
        const localVariablesSections = data?.length > 0 ? data : [...updatedVariables]
        const updatedVariablesCopy = localVariablesSections?.map(section => {
            const updatedSection = { ...section };
            updatedSection.fields = section?.fields?.map((variable: any) => {
                return applyRulesToVariable(variable);
            });
            return updatedSection;
        });
        setupdatedVariables(updatedVariablesCopy)
    }

    // rules engine function for simple variables without sections
    function rulesEngineDataElements(data: any[] = []) {
        const localVariables = data?.length > 0 ? data : [...updatedVariables]
        const updatedVariablesCopy = localVariables?.map(variable => {
            return applyRulesToVariable(variable);
        });

        setupdatedVariables(updatedVariablesCopy);
    }

    // apply rules to variables
    function applyRulesToVariable(variable: any) {
        for (const programRule of newProgramRules.filter(x => x.variable === variable.name) || []) {
            switch (programRule.type) {
                case "attribute":
                case "dataElement":
                    switch (programRule.programRuleActionType) {
                        case "ASSIGN":
                            if (variable.name === programRule.variable) {
                                // Obter a primeira condição e o valor associado
                                const firstCondition = existValue(programRule.condition, values, formatKeyValueType);
                                const value = executeFunctionName(programRule.functionName, existValue(programRule.data, values, formatKeyValueType));


                            
                                try {
                                    // Avaliar a condição uma vez
                                    const evaluatedCondition = eval(firstCondition ?? "");
                            
                                    // Verificar se a condição é uma string e o tipo de variável
                                    const isStringCondition = typeof evaluatedCondition === "string" || typeof evaluatedCondition === "boolean";
                                    const isValidType = formatKeyValueType[variable.name] !== "INTEGER_ZERO_OR_POSITIVE" && formatKeyValueType[variable.name] !== "NUMBER";
                                    
                                    if (isStringCondition && isValidType) {
                                        if (evaluatedCondition) {
                                            // Atribuição de valores caso a condição seja verdadeira
                                            values[variable.name] = value !== undefined ? value : "";
                                            variable.value = value !== undefined ? value : "";
                                        }
                                    } 
                                    // Verificar se a condição é um número
                                    else if (typeof evaluatedCondition === "number") {
                                        values[variable.name] = value !== undefined ? value : "";
                                        variable.value = value !== undefined ? value : "";
                                    }
                                    
                                    // Desabilitar a variável após o processamento
                                    variable.disabled = true;
                                    
                                } catch (error) {
                                    // Em caso de erro, desabilitar a variável
                                    console.error("Erro ao avaliar a condição:", error);
                                    variable.disabled = true;
                                }
                            }
                            
                            break;
                        case "SHOWOPTIONGROUP":
                            if (variable.name === programRule.variable) {
                                if (executeFunctionName(programRule.functionName, existValue(programRule.condition, values, formatKeyValueType))) {
                                    const options = getOptionGroups?.filter((op) => op.id === programRule.optionGroup)?.[0]?.options || []
                                    variable.options = { optionSet: { options: options } }
                                }
                            }
                            break;
                        case "SHOWWARNING":
                            if (variable.name === programRule.variable) {
                                if (executeFunctionName(programRule.functionName, existValue(programRule.condition, values, formatKeyValueType))) {
                                    variable.content = programRule.content
                                    variable.warning = true
                                } else {
                                    variable.content = ""
                                    variable.warning = false
                                }
                            }
                            break;
                        case "SHOWERROR":
                            if (variable.name === programRule.variable) {
                                if (executeFunctionName(programRule.functionName, existValue(programRule.condition, values, formatKeyValueType))) {
                                    variable.error = true;
                                    variable.content = programRule.content
                                    variable.required = true;
                                } else {
                                    variable.error = false;
                                    variable.content = ""
                                    variable.required = false;
                                }
                            }
                            break;
                        case "HIDEFIELD":
                            if (variable.name === programRule.variable) {
                                if (executeFunctionName(programRule.functionName, existValue(programRule.condition, values, formatKeyValueType))) {
                                    variable.visible = false;
                                } else {
                                    variable.visible = true;
                                }
                            }
                            break;
                        case "HIDESECTION":
                            break;

                        case "HIDEOPTIONGROUP":
                            if (variable.name === programRule.variable) {
                                const orgUnitGroup = programRule?.condition?.replace(/[^a-zA-Z]/g, '')
                                const foundOrgUnitGroup = orgUnitsGroups?.filter(x => x.value === orgUnitGroup)

                                if (foundOrgUnitGroup.length > 0) {

                                    if (foundOrgUnitGroup[0]?.organisationUnits.findIndex(x => x.value === values["orgUnit"]) > -1) {
                                        const options = getOptionGroups?.filter((op) => op.id === programRule.optionGroup)?.[0]?.options?.slice()?.sort(compareStringByLabel) || []

                                        variable.options = { optionSet: { options: variable?.initialOptions?.optionSet?.options?.filter((obj1: { value: string }) => !options.some(obj2 => obj2.value === obj1.value)) } }
                                    }
                                }
                            }
                            break;

                        default:
                            break;
                    }
                    break;
            }
        }
        return variable;
    }

    return {
        runRulesEngine,
        updatedVariables
    }
}

// remove scpecial characters
export function removeSpecialCharacters(text: string | undefined) {
    if (typeof text === "string") {
        return text
            .replaceAll("d2:hasValue", "")
            .replaceAll("d2:yearsBetween", "")
            .replaceAll("d2:concatenate", "")
            .replaceAll("d2:inOrgUnitGroup", "")
            .replaceAll("#{", "")
            .replaceAll("A{", "")
            .replaceAll("V{", "")
            .replaceAll("}", "")
            .replaceAll("current_date", `'${format(new Date(), "yyyy-MM-dd")}'`);
    }
}

// replace condition with specific variable
export function replaceConditionVariables(condition: string | undefined, variables: Record<string, string | undefined>) {
    if (!condition) {
        return condition;
    }

    // Regex para capturar palavras completas fora de aspas simples
    const regex = /(\b\w+\b)(?=(?:[^']*'[^']*')*[^']*$)/g;

    // Substituição
    const newcondition = condition.replace(regex, (match) => {
        return variables[match] !== undefined ? `'${variables[match]}'` : match;
    });
    return newcondition;
}

// get function name
export function getFunctionExpression(condition: string | undefined) {
    return condition?.split("d2:")?.[1]?.split("(")[0];
}

// replace variables with specific value
export function replaceEspecifValue(values: Record<string, any>, variables: Record<string, string>, variable: string) {
    // eslint-disable-next-line no-prototype-builtins
    if (values.hasOwnProperty(variables[variable])) {
        if (values[variables[variable]] != false) {
            return `'${values[variables[variable]]}'`;
        }
    }

    return false;
}

function isDate(str: string) {
    // Remove os parênteses se existirem
    if (typeof str === 'string') {
        const cleanedStr = str?.replace(/[()]/g, '');

        // Tenta criar um objeto Date
        const date = new Date(cleanedStr);

        // Verifica se a data é válida
        return !isNaN(date.getTime());
    }
    return str;
}

// execute function
function executeFunctionName(functionName: string | undefined, condition: string | undefined) {
    switch (functionName) {
        case "hasValue":
            return isDate(condition!) ? condition : eval(condition ?? "");
        case "yearsBetween":
            return eval(d2YearsBetween(condition, condition?.split(")")) ?? "");

        case "inOrgUnitGroup":
            return true

        case "length":
            return eval(compareLength(condition ?? ""))

        case "substring":
            let function_paramter = returnSubstring(condition?.split("d2:substring(").pop() ?? "")
            const formated_function = condition?.replaceAll(condition?.split("d2:substring(").pop() as string, function_paramter).replaceAll("d2:substring", '').replaceAll("(", '')
            return eval(formated_function as string)

        default:
            return eval(condition ?? "");
    }
}

function returnSubstring(value: string) {
    const [stringToRepair, startStr, endStr] = value.replaceAll(")", "").split(",");
    const start = Number(startStr);
    const end = Number(endStr);

    const repairedString = stringToRepair.substring(start, end)

    if (!isNaN(Number.parseInt(repairedString)))
        return Number.parseInt(repairedString) as unknown as string
    else
        return `'${repairedString}'`
}

//compare values in string
function compareLength(condition: string) {
    const results = [];
    let newcondition = 'false'
    for (const match of condition?.matchAll(/d2:length\('(.*?)'\)/g)) {
        results.push(match[1]);

    }

    for (const result of results) {
        newcondition = condition?.replace(`d2:length('${result}')`, `${result.length}`)
    }

    return newcondition
}

// get years between dates
function d2YearsBetween(origin: string | undefined, condition: string[] | undefined): string | undefined {
    if (!origin || !condition || condition.length !== 1) {
        return undefined;
    }
    const [date1Str, date2Str] = condition[0].split(",").map(date => date.trim());
    const date1 = new Date(date1Str.replaceAll("(", ""));
    const date2 = new Date(date2Str);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        return undefined;
    }
    const diffYears = Math.abs(date2.getFullYear() - date1.getFullYear());
    return origin.replace(condition[0], String(diffYears)).replace(")", "");
}



// replace varieble by value from condition
export function existValue(condition: string | undefined, values: Record<string, any> = {}, formatKeyValueType: any) {
    let localCondition = condition as string;
    let valueToReturn = condition as string
    const dataArray = condition?.split(/[^a-zA-Z0-9À-ÿ_ ]+/)
        .map(item => item.trim().replace(/^'(.*)'$/, '$1')).filter(item => item.length > 0);

    for (const value of Object.keys(values) || []) {
        if (dataArray?.includes(value)) {

            if (localCondition.includes(`false`)) {
                localCondition = condition as string
            }

            switch (formatKeyValueType[value]) {
                case "BOOLEAN":
                    localCondition = localCondition.replaceAll(value, `${values[value]}`.replaceAll("false", "0").replaceAll("true", "1"))
                    break;

                case "NUMBER":
                case "INTEGER_ZERO_OR_POSITIVE":
                    valueToReturn = valueToReturn.replaceAll(`'${value}'`, String(Number(values[value] ?? 0)))
                    if (!/[a-zA-Z]/.test(valueToReturn)) {
                        localCondition = valueToReturn
                    } else {
                        localCondition = "0"
                    }
                    break;

                default:
                    localCondition = localCondition.replaceAll(value, `${values[value]}`)
                    break;
            }
        }
    }

    return localCondition;
}

export function getValueTypeVariable(variables: any, variable: any, type: string) {
    if (type === "programStageSection") {
        let variableType = ""
        variables?.map((section: any) => {
            section?.fields?.map((sectionVar: any) => {
                if (sectionVar.name === variable.variable) {
                    variableType = sectionVar.valueType
                }
            });
        });
        return variableType
    }
}