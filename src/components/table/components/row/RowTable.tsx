import classNames from 'classnames';
import React from 'react'
import styles from '../table.module.css';
import { RowProps } from '../../../../types/table/TableContentProps';

function RowTable(props: RowProps): React.ReactElement {
    const { children, className, table, ...passOnProps } = props;

    const classes = classNames(
        styles.tableRow,
        {
            [styles.tableRowBody]: table == null,
            [styles.tableRowHeader]: table?.head,
            [styles.tableRowFooter]: table?.footer
        },
        className
    );

    return (
        <tr
            className={classes}
            {...passOnProps}
        >
            {children}
        </tr>
    )
}

export default RowTable
