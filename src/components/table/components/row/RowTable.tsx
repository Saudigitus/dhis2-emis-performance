import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import Tooltip from "@material-ui/core/Tooltip";
import useGetSectionTypeLabel from "../../../../hooks/commons/useGetSectionTypeLabel";
import {type RowProps } from '../../../../types/table/TableContentProps';
function RowTable(props: RowProps): React.ReactElement {
    const {
        children,
        className,
        table,
        passOnProps,
        inactive = false
    } = props;

    const classes = classNames(
        defaultClasses.tableRow,
        {
            [defaultClasses.tableRowBody]: table == null,
            [defaultClasses.tableRowHeader]: table?.head,
            [defaultClasses.tableRowFooter]: table?.footer
        },
        className,
        inactive && defaultClasses.disabledRow
    );

    return (
        <Tooltip arrow={true} disableHoverListener={!inactive} disableFocusListener={true}
                 title={inactive && 'This enrollment is inactive'}>
            <tr
                className={classes}
                {...passOnProps}
            >
                {children}
            </tr>
        </Tooltip>
    )
}

export default RowTable
