import { ProgramStageConfig } from "../programStageConfig/ProgramStageConfig"
import { OptionsProps } from "../variables/AttributeColumns"

interface ProgramIndicatorConfig {
    id: string
    expression: string
    displayName: string
    displayFormName: string
}
interface ProgramConfig {
    displayName: string
    id: string
    description: string
    access?: any
    programType: string
    programStages: ProgramStageConfig[]
    programIndicators: ProgramIndicatorConfig[],
    programTrackedEntityAttributes: [
        {
            trackedEntityAttribute: {
                generated: boolean
                pattern?: string
                displayName: string
                id: string
                valueType: string
                optionSet: { id: string, options: OptionsProps[] }
            }
            searchable: boolean
            displayInList: boolean
            mandatory: boolean
        }
    ]
    trackedEntityType: {
        trackedEntityTypeAttributes: [
            {
                trackedEntityAttribute: {
                    id: string
                }
            }
        ]
        id: string
    }
}

export type { ProgramConfig, ProgramIndicatorConfig }
