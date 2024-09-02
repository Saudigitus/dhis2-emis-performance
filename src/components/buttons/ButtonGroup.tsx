import * as React from 'react';
import { Button, ButtonGroup as BG } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';

type ButtonItem = {
    color: string;
    label?: string;
    onClick: () => void;
    icon: React.ReactNode
    disabled:boolean
    tooltip: string
};

interface ButtonGroupProps {
    color?: string
    buttons: ButtonItem[]
};

export function ButtonGroup(props: ButtonGroupProps) {
    const { buttons } = props

    return (
        <BG variant="outlined" color="primary">
            {buttons.map((button, index) => (
                <Tooltip title={button.tooltip}>
                    <Button
                        key={index}
                        disabled={button.disabled}
                        onClick={button.onClick}
                        style={{ color: button.color }}
                    >
                        {button.icon}
                        {button?.label}
                    </Button>
                </Tooltip>
            ))}
        </BG>
    );
}