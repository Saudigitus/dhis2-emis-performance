import React, { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { makeStyles, type Theme, createStyles } from '@material-ui/core/styles';
import { RowCell, RowTable } from '../components';
import { useRecoilState } from 'recoil';
import { EventsState, SubTabState } from '../../../schema/termMarksSchema';
import { type FieldFeedbackProps } from '../../../types/table/MarksFieldsFeedback';
import ShowFieldsBasedValueType from '../components/row/showFieldsBasedValueType';
import { type RenderHeaderProps } from '../../../types/table/TableContentProps';
import { usePostDataElement } from '../../../hooks';
import { checkCompleted } from "../../../utils/table/rows/checkCanceled";
import RowActions from '../components/rowsActions/RowActions';

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
        opacity: { backgroundColor: "#e8f5e9" }
    })
);

function RenderRows(props: RenderHeaderProps): React.ReactElement {
    const { rowsData, headerData, loader } = props
    const classes = useStyles()
    const [allEvents] = useRecoilState(EventsState);
    const [selectedTerm] = useRecoilState(SubTabState);
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
                    colspan={headerData?.filter(x => x?.visible)?.length}
                >
                    {i18n.t('No data to display')}
                </RowCell>
            </RowTable>
        );
    }

    console.log(rowsData,headerData)
    return (
        <React.Fragment>
            {
                rowsData?.map((row, index) => {
                    const cells = headerData?.filter(x => x?.visible)?.map(column => (
                        <RowCell
                            key={column.id}
                            className={classNames(classes.cell, classes.bodyCell)}
                        >
                            <div>
                                <ShowFieldsBasedValueType
                                    loader={loader}
                                    column={column}
                                    currentEvent={allEvents[index]}
                                    saveMarks={saveMarks}
                                    value={row[column.id]}
                                    trackedEntity={row.trackedEntity}
                                    setShowFeedBack={setShowFeedBack}
                                    showFeedBack={showFeedBack}
                                    headers={headerData}
                                    prevValues={prevValues}
                                    setPrevValues={setPrevValues}
                                    inactive={checkCompleted(row.eventStatus)}
                                />
                            </div>
                            {(column.displayName == "Actions") && <RowActions row={row} inactive={checkCompleted(row.eventStatus)} />}
                        </RowCell>
                    ));
                    return (
                        <RowTable
                            key={index}
                            className={classNames(classes.row, classes.dataRow, checkCompleted(row.eventStatus) && classes.opacity)}
                            inactive={checkCompleted(row.eventStatus)}
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
