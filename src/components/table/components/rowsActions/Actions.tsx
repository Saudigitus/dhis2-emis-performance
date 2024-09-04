import React from 'react';
import { IconMore24 } from '@dhis2/ui'
import { Button, ListItemText, Menu, MenuItem } from '@material-ui/core';

interface BasicMenuProps {
    menuItems: any[]
}

export default function Actions(props: BasicMenuProps) {
    const { menuItems } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div>
            <Button
                id="basic-button"
                aria-haspopup="true"
                onClick={handleClick}
                aria-expanded={open ? 'true' : undefined}
                aria-controls={open ? 'basic-menu' : undefined}
            >
                <IconMore24 />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems?.map((item: any, index: any) => (
                    <MenuItem
                        dense
                        key={index}
                        onClick={() => {
                            item.onClick();
                            handleClose();
                        }}
                    >
                        <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
