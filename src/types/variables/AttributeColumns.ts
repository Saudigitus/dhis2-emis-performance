import { type Attribute } from '../generated/models';

export enum VariablesTypes {
    DataElement = "dataElement",
    Attribute = "attribute",
    Custom = "custom",
    HasEvent = "hasevent",
    Performance = "Performance"
}

export enum enrollmentStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface CustomAttributeProps {
    id: string
    rawId?:string
    displayName: string
    header: string
    required: boolean
    name: string
    programStage?: string
    value?: string
    labelName: string
    valueType: typeof Attribute.valueType
    disabled: boolean
    visible: boolean
    options: {
        optionSet: {
            id: string
            options: OptionsProps[]
        }
    }
    initialOptions: {
        optionSet: {
            id: string
            options: OptionsProps[]
        }
    }
    pattern?: string
    searchable?: boolean
    error?: boolean
    content?: string
    key?: any
    description?: string
    displayInFilters: boolean
    type: VariablesTypes
    info: string
}

export interface OptionsProps {
    value: string
    label: string
}
