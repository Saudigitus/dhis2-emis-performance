interface ButtonProps {
    type?: string;
    children?: React.ReactNode;
    label: string;
    small?: boolean
    onClick: () => void
    icon: React.ReactNode;
    primary?: boolean
    destructive?: boolean
    secondary?: boolean
    disabled?: boolean
    loading?: boolean
}

export type { ButtonProps }