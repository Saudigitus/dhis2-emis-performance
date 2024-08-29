export interface TermMarksConfig {
    id: string
    label?: string
    programStage:string, 
    hasProgramStage: boolean
    programIndicators: { id: string }[]
}
