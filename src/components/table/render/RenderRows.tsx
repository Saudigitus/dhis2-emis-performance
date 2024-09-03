import React, { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { makeStyles, type Theme, createStyles } from '@material-ui/core/styles';
import { RowCell, RowTable } from '../components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { EventsState, SubTabState } from '../../../schema/termMarksSchema';
import { type FieldFeedbackProps } from '../../../types/table/MarksFieldsFeedback';
import ShowFieldsBasedValueType from '../components/row/showFieldsBasedValueType';
import { type RenderHeaderProps } from '../../../types/table/TableContentProps';
import { useParams, usePostDataElement } from '../../../hooks';
import { checkCanceled } from "../../../utils/table/rows/checkCanceled";
import RowActions from '../components/rowsActions/RowActions';
import { getDataStoreKeys, getSelectedKey } from '../../../utils';
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig';
import { ProgramConfigState } from '../../../schema/programSchema';
import { dataValues } from '../../../utils/table/rows/formatResponseRows';

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
    const { rowsData, headerData, loader, events } = props
    const classes = useStyles()
    const [allEvents] = useRecoilState(EventsState);
    const [selectedTerm] = useRecoilState(SubTabState);
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig = useRecoilValue(ProgramConfigState)
    const { urlParamiters } = useParams()
    const { moduloAdministrativo } = urlParamiters()
    const selected = programConfig?.programStages?.find(x => x.id === getDataStoreData.monitoria.programStage)?.programStageDataElements?.find(de => de.dataElement.id === getDataStoreData.monitoria.filters.dataElements[0].dataElement)?.dataElement
    const { saveMarks } = usePostDataElement()
    const [prevValues, setPrevValues] = useState<Object>({})
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
                    console.log(allEvents)
                    const currEvent = events?.find((x: any) => x?.trackedEntity === row?.trackedEntity)
                    const copyRow = { ...row, ...dataValues(currEvent?.dataValues ?? [], getDataStoreData.monitoria.programStage), event: currEvent?.event }
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
                                    inactive={checkCanceled(row.eventStatus)}
                                    disableInput={currEvent?.event ? false : true}
                                />
                            </div>
                            {(moduloAdministrativo && column.id === selected?.id) && <RowActions disabled={checkCanceled(row.eventStatus)} event={currEvent?.event} row={row} />}
                        </RowCell>
                    ));
                    return (
                        <RowTable
                            key={index}
                            className={classNames(classes.row, classes.dataRow, checkCanceled(row.eventStatus) && classes.opacity)}
                            inactive={checkCanceled(row.eventStatus)}
                        >
                            {cells}
                        </RowTable>
                    );
                })
            }
        </React.Fragment>
    )
}

export default RenderRows
