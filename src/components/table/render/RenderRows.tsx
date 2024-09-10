import React, { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { makeStyles, type Theme, createStyles } from '@material-ui/core/styles';
import { RowCell, RowTable } from '../components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SubTabState } from '../../../schema/termMarksSchema';
import { type FieldFeedbackProps } from '../../../types/table/MarksFieldsFeedback';
import ShowFieldsBasedValueType from '../components/row/showFieldsBasedValueType';
import { type RenderHeaderProps } from '../../../types/table/TableContentProps';
import { useParams, usePostDataElement } from '../../../hooks';
import { checkCompleted } from "../../../utils/table/rows/checkCompleted";
import RowActions from '../components/rowsActions/RowActions';
import { getSelectedKey } from '../../../utils';
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig';
import { ProgramConfigState } from '../../../schema/programSchema';
import { dataValues } from '../../../utils/table/rows/formatResponseRows';
import { format } from 'date-fns';
import { Checkbox } from '@material-ui/core';
import { RowSelectorState } from '../../../schema/rowSelectorSchema';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: { width: "100%" },
        dataRow: {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#F1FBFF'
            }
        },
        cell: {
            padding: `${theme.spacing(1) / 2}px ${theme.spacing(1) * 7}px ${theme.spacing(1) /
                2}px ${theme.spacing(1) * 3}px`,
            '&:last-child': {
                paddingRight: theme.spacing(1) * 1,
                paddingLeft: theme.spacing(1) * 1.5
            },
            borderBottomColor: "rgba(224, 224, 224, 1)"
        },
        bodyCell: {
            fontSize: theme.typography.pxToRem(13),
            color: theme.palette.text.primary
        },
        opacity: { opacity: 0.5 }
    })
);

function RenderRows(props: RenderHeaderProps): React.ReactElement {
    const { rowsData, headerData, loader, events, allChecked, setAllChecked } = props
    const classes = useStyles()
    const [selectedTerm] = useRecoilState(SubTabState);
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig = useRecoilValue(ProgramConfigState)
    const { urlParamiters } = useParams()
    const { moduloAdministrativo } = urlParamiters()
    const selected = programConfig?.programStages?.find(x => x.id === getDataStoreData?.monitoria?.programStage)?.programStageDataElements?.find(de => de.dataElement.id === getDataStoreData?.monitoria?.filters?.dataElements[0].dataElement)?.dataElement
    const { saveMarks } = usePostDataElement()
    const [prevValues, setPrevValues] = useState<Object>({})
    let [selectedRows, setSelectedRows] = useRecoilState(RowSelectorState)
    const [showFeedBack, setShowFeedBack] = useState<FieldFeedbackProps>({
        dataElement: '',
        feedbackType: ''
    })

    useEffect(() => {
        setShowFeedBack({
            dataElement: '',
            feedbackType: ''
        })
    }, [selectedTerm])

    function onCheck(event: any) {
        if (selectedRows?.[event.event]) {
            if (allChecked) setAllChecked(false)
            const copy = { ...selectedRows }
            delete copy[event.event]
            setSelectedRows({ ...copy })
        } else {
            setSelectedRows((prevSelected: any) => ({ ...prevSelected, [event.event]: event }))
        }
    }

    if (rowsData?.length === 0) {
        return (
            <RowTable
                className={classes.row}
            >
                <RowCell
                    className={classNames(classes.cell, classes.bodyCell)}
                    colspan={headerData?.filter(x => x.visible)?.length}
                >
                    {i18n.t('No data to display')}
                </RowCell>
            </RowTable>
        );
    }

    return (
        <React.Fragment>
            {
                rowsData?.map((row, index) => {
                    const currEvent = events?.find((x: any) => x?.trackedEntity === row?.trackedEntity)

                    const copyRow = {
                        ...row,
                        eventDate: currEvent?.occurredAt && format(new Date(currEvent?.occurredAt), "yyyy-MM-dd"),
                        ...(dataValues(currEvent?.dataValues ?? [], getDataStoreData?.monitoria?.programStage) ?? {}),
                        event: currEvent?.event
                    }

                    const cells = headerData?.filter(x => x.visible)?.map(column => (
                        <RowCell
                            key={column.id}
                            className={classNames(classes.cell, classes.bodyCell)}
                        >
                            <div>
                                <ShowFieldsBasedValueType
                                    loader={loader}
                                    column={column}
                                    currentEvent={currEvent}
                                    saveMarks={saveMarks}
                                    value={copyRow[column.id] ?? copyRow[column.rawId]}
                                    trackedEntity={row.trackedEntity}
                                    setShowFeedBack={setShowFeedBack}
                                    showFeedBack={showFeedBack}
                                    headers={headerData}
                                    prevValues={prevValues}
                                    setPrevValues={setPrevValues}
                                    inactive={checkCompleted(currEvent?.status)}
                                    disableInput={currEvent?.event ? false : true}
                                />
                            </div>
                            {((moduloAdministrativo && column.id === selected?.id) || column.id == 'complete') &&
                                <RowActions
                                    completed={checkCompleted(currEvent?.status)}
                                    complete={column.id === 'complete'}
                                    event={currEvent}
                                    row={row}
                                />
                            }
                        </RowCell>
                    ));
                    return (
                        <RowTable
                            key={index}
                            className={classNames(classes.row, classes.dataRow)}
                            inactive={checkCompleted(currEvent?.status)}
                        >
                            <RowCell
                                className={classNames(classes.cell, classes.bodyCell)}
                            >
                                <div onClick={(event) => { event.stopPropagation(); }}>
                                    <Checkbox
                                        checked={selectedRows[currEvent?.event] ? true : false}
                                        name="Ex"
                                        onChange={() => onCheck(currEvent)}
                                        color="primary"
                                        disabled={currEvent?.event ? checkCompleted(currEvent?.status) === true ? true : false : true}
                                    />
                                </div>
                            </RowCell>
                            {cells}
                        </RowTable>
                    );
                })
            }
        </React.Fragment>
    )
}

export default RenderRows
