import React, { useMemo } from 'react'
import { RowCell, RowTable } from '../components'
import classNames from 'classnames';
import { makeStyles, createStyles, type Theme } from '@material-ui/core/styles';
import HeaderCell from '../components/head/HeaderCell';
import { RenderHeaderProps } from '../../../types/table/TableContentProps';
import { Checkbox } from '@material-ui/core';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { RowSelectorState } from '../../../schema/rowSelectorSchema';
import { EventsState } from '../../../schema/termMarksSchema';
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
    const { rowsHeader, rowsData } = props
    const classes = useStyles()
    const monitoriaEvents = useRecoilValue(EventsState);
    let [selectedEvents, SetSelectedRows] = useRecoilState(RowSelectorState)

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
            let events: any = {}
            const validEvents = monitoriaEvents.filter(x => x != undefined)

            for (const event of validEvents) {
                if (rowsData?.find(x => x.trackedEntity === event.trackedEntity) && event.event && checkCompleted(event?.status) === false)
                    events[event.event] = event
            }

            SetSelectedRows(events)
        } else {
            SetSelectedRows({})
        }
    }

    return (
        <thead>
            <RowTable
                className={classes.row}
            >
                <RowCell
                    className={classNames(classes.cell, classes.bodyCell)}
                >
                    <div onClick={(event) => { event.stopPropagation(); }}>
                        <Checkbox
                            checked={monitoriaEvents.filter(x => x != undefined && checkCompleted(x?.status) === false).length === Object.keys(selectedEvents).length}
                            name="Ex"
                            onChange={(event: any) => checkAll(event)}
                            color="primary"
                        />
                    </div>
                </RowCell>
                {headerCells}
            </RowTable>
        </thead>
    )
}

export default RenderHeader
