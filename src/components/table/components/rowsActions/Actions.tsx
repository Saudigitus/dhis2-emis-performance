import React from 'react';
import { CircularLoader, CenteredContent, IconEdit24 } from '@dhis2/ui'
import { ListItemText, Menu, MenuItem } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Edit, MoreVert } from '@material-ui/icons';
import { ListItemIcon } from '@material-ui/core';

interface BasicMenuProps {
    menuItems: any[]
    inactive: boolean
    completing: boolean
    editOption?: boolean
    openEdit: any
}

export default function Actions(props: BasicMenuProps) {
    const { menuItems, inactive, completing, editOption, openEdit } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <CenteredContent>
                {completing ? <CircularLoader small /> :
                    editOption ?
                        <IconButton
                            id="basic-button"
                            aria-haspopup="true"
                            style={{ color: "#000" }}
                            onClick={openEdit}
                        >
                            < IconEdit24 />
                        </IconButton>
                        :
                        <IconButton
                            id="basic-button"
                            aria-haspopup="true"
                            onClick={handleClick}
                            aria-expanded={open ? 'true' : undefined}
                            aria-controls={open ? 'basic-menu' : undefined}
                            style={{ color: "#000" }}
                        >
                            < MoreVert />
                        </IconButton>
                }
            </CenteredContent>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {menuItems?.map((item: any, index: any) => (
                    <MenuItem
                        dense
                        key={index}
                        disabled={item.disabled}
                        onClick={() => {
                            item.onClick();
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
