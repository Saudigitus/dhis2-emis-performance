
interface ModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    title: string
    children: React.ReactNode
}

interface ModalContentProps {
    setOpen: (value: boolean) => void
}

interface ModalContentProgramStageProps {
    open: boolean
    setOpen: (value: boolean) => void
    nexProgramStage: string
    loading: boolean
    formInitialValues: any
    row: any
}


export type { ModalProps, ModalContentProps, ModalContentProgramStageProps }