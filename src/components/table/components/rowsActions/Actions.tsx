import * as React from 'react';
import { IconMore24 } from '@dhis2/ui'
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';

interface BasicMenuProps {
    row: any
}

export default function Actions(props: BasicMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuItems: any = [
        { label: 'Complete', onClick: () => { }, icon: <IconMore24 /> },
        { label: 'Download', onClick: () => { }, icon: <IconMore24 /> },
    ];

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
                dense
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems.map((item: any, index: any) => (
                    <>
                        <MenuItem
                            dense
                            key={index}
                            onClick={() => {
                                item.onClick();
                                handleClose();
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>{item.label}</ListItemText>
                        </MenuItem>
                        {index + 1 !== menuItems.length && < Divider />}

                    </>
                ))}
            </Menu>
        </div>
    );
}
