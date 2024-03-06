import React from 'react'
import { IconButton } from '@material-ui/core';
import styles from '../../table.module.css';
import { IconButtonPaginationProps } from '../../../../../types/table/PaginationProps';

export function IconButtonPagination(props: IconButtonPaginationProps): React.ReactElement {
    return (
        <IconButton
            className={styles.iconButton}
            onClick={props.onPageChange}
            disabled={props.disabled}
            aria-label={props.ariaLabel}
        >
            {props.Icon}
        </IconButton>
    )
}
