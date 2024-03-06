import React, { useMemo } from 'react'
import { RowTable, SortLabel } from '../components'
import classNames from 'classnames';
import { makeStyles, createStyles, type Theme } from '@material-ui/core/styles';
import HeaderCell from '../components/head/HeaderCell';
import { type CustomAttributeProps } from '../../../types/variables/AttributeColumns';
import { RenderHeaderProps } from '../../../types/table/TableContentProps';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: { width: "100%" },
        cell: {
            padding: `${theme.spacing(1) / 2}px ${theme.spacing(1) * 7}px ${theme.spacing(1) /
                2}px ${theme.spacing(1) * 3}px`,
            '&:last-child': {
                paddingRight: 2 * 3
            },
            borderBottomColor: "rgba(224, 224, 224, 1)"
        },
        bodyCell: {
            fontSize: theme.typography.pxToRem(13),
            color: theme.palette.text.primary
        },
        headerCell: {
            fontSize: theme.typography.pxToRem(12),
            color: theme.palette.text.secondary,
            fontWeight: 500
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1
        }
    })
);

function RenderHeader(props: RenderHeaderProps): React.ReactElement {
    const { rowsHeader, order, orderBy, createSortHandler } = props
    const classes = useStyles()

    const headerCells = useMemo(() => {
        return rowsHeader?.filter(x => x.visible)?.map((column, index) => (
            <HeaderCell
                key={column.id}
                className={classNames(classes.cell, classes.headerCell)}
            >
                {/* TODO: the sortLabel must be optional 👇 */}

                {column.header}
            </HeaderCell>
        ))
    }, [rowsHeader]);

    return (
        <thead>
            <RowTable
                className={classes.row}
            >
                {headerCells}
            </RowTable>
        </thead>
    )
}

export default RenderHeader
