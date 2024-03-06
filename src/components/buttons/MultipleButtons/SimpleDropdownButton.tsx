import React, { useState } from "react";
import styles from "../button.module.css";
import { Menu, MenuItem, Button } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { SimpleButtonsComponentProps, SimpleButtonsType } from "../../../types/buttons/SimpleButtonsProps";
import classNames from "classnames";

export default function SimpleDropdownButton(props: SimpleButtonsComponentProps): React.ReactElement {
  const { items, selectedTerm, setSelectedTerm } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectTerm = (item: SimpleButtonsType) => {
    setSelectedTerm(item); 
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        className={styles.simpleDropdownButton}
        variant="outlined"
        onClick={handleClick}
        endIcon={anchorEl === null ? <ExpandMore className={styles.dropdownIcon}/> : <ExpandLess className={styles.dropdownIcon}/>}
      >
        {selectedTerm.label ?? "Terms"}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          style: { boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }
         }}
      >
        {items.map((item, i) => (
          <MenuItem
            key={i}
            className={classNames(styles.simpleMenuItem, selectedTerm.id === item.id && styles.activeMenuItem)}
            onClick={() => handleSelectTerm(item)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>{" "}
    </>
  );
}
