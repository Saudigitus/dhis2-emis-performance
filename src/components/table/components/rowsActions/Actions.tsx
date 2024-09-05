import React from 'react';
import { CircularLoader, CenteredContent } from '@dhis2/ui'
import { ListItemText, Menu, MenuItem } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

interface BasicMenuProps {
    menuItems: any[]
    inactive: boolean
    completing: boolean
}

export default function Actions(props: BasicMenuProps) {
    const { menuItems, inactive, completing } = props;
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
                    <IconButton
                        id="basic-button"
                        aria-haspopup="true"
                        onClick={handleClick}
                        aria-expanded={open ? 'true' : undefined}
                        aria-controls={open ? 'basic-menu' : undefined}
                        style={inactive ? { background: "#ffffffb9", color: "#000", Opacity: "1", height: "42px", width: "42px", } : { height: "42px", width: "42px" }}
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
        </>
    );
}
