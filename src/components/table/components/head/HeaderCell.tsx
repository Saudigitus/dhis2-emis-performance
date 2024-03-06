import classNames from 'classnames';
import React from 'react'
import styles from '../table.module.css';
import { HeaderCellProps } from '../../../../types/table/TableContentProps';

function HeaderCell(props: HeaderCellProps): React.ReactElement {
    const { children, className, passOnProps, table, colspan } = props;

    const classes = classNames(
        styles.tableCell,
        {
            [styles.tableCellBody]: table == null,
            [styles.tableCellHeader]: table?.head,
            [styles.tableCellFooter]: table?.footer
        },
        className
    );
    return (
        <td
            className={classes}
            {...passOnProps}
            colSpan={colspan}
        >
            {children}
        </td>
    );
};

export default HeaderCell
