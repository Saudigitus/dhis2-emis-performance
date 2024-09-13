import React, { useMemo, useEffect, useState } from 'react'
import { RowCell, RowTable } from '../components'
import classNames from 'classnames';
import { makeStyles, createStyles, type Theme } from '@material-ui/core/styles';
import HeaderCell from '../components/head/HeaderCell';
import { RenderHeaderProps } from '../../../types/table/TableContentProps';
import { Checkbox } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { RowSelectorState } from '../../../schema/rowSelectorSchema';
import { checkCompleted } from '../../../utils/table/rows/checkCompleted';

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
    const { rowsHeader, rowsData, allChecked, setAllChecked, events } = props
    const classes = useStyles()
    const [monitoriaEvents, setMonitoriaEvents] = useState<any>({})
    const [disabled, setDisabled] = useState(true)
    let [, SetSelectedRows] = useRecoilState(RowSelectorState)


    useEffect(() => {
        let tableEvents: any = {}
        const validEvents = events?.filter((x: any) => x != undefined) ?? []

        for (const event of validEvents) {
            if (rowsData?.find(x => x.trackedEntity === event.trackedEntity) && checkCompleted(event?.status) === false) {
                tableEvents[event.event] = event
            }
        }

        if (Object.keys(tableEvents).length > 0) {
            setDisabled(false)
            setMonitoriaEvents(tableEvents)
        }
    }, [rowsData])

    const headerCells = useMemo(() => {
        return rowsHeader?.filter(x => x.visible)?.map((column) => (
            <HeaderCell
                key={column.id}
                className={classNames(classes.cell, classes.headerCell)}
            >
                {column.header}
            </HeaderCell>
        ))
    }, [rowsHeader]);

    function checkAll(inputEvent: any) {
        if (inputEvent.target.checked) {
            setAllChecked(true)
            SetSelectedRows(monitoriaEvents)
        } else {
            setAllChecked(false)
            SetSelectedRows({})
        }
    }

    // console.log(rowsData?.map(x => x.trackedEntity), events, 'kekekeke')

    return (
        <thead>
            <RowTable
                className={classes.row}
            >
                <RowCell
                    className={classNames(classes.cell, classes.bodyCell)}
                >
                    <div onClick={(event) => { event.stopPropagation(); }}>
                        Selecionar Todas
                        <Checkbox
                            checked={allChecked}
                            name="Ex"
                            onChange={(event: any) => checkAll(event)}
                            color="primary"
                            disabled={disabled}
                        />
                    </div>
                </RowCell>
                {headerCells}
            </RowTable>
        </thead>
    )
}

export default RenderHeader
