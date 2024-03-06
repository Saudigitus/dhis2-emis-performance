import React from 'react'
import { VariablesTypes } from '../../../../types/variables/AttributeColumns';
import { Form } from 'react-final-form';
import GenericFields from '../../../genericFields/GenericFields';
import styles from "./row.module.css"
import { ShowFieldsBasedValueTypeProps } from '../../../../types/table/TableContentProps';

export default function ShowFieldsBasedValueType(props: ShowFieldsBasedValueTypeProps) {
    const { column, value, currentEvent, saveMarks, showFeedBack, setShowFeedBack } = props;
    
    const onSubmit = (event: any) => {
        void saveMarks({
            data: {

                event: currentEvent?.event,
                orgUnit: currentEvent?.orgUnit,
                dataValues: [{
                    dataElement: column.id,
                    value: event.target.value
                }],
                program: currentEvent?.program,
                status: currentEvent?.status,
                trackedEntity: currentEvent?.trackedEntity,
                programStage: currentEvent?.programStage,
            },
            id: `${currentEvent?.event}/${column.id}`
        }).then(() => {
            setShowFeedBack({
                dataElement: `${currentEvent?.event}/${column.id}`,
                feedbackType: 'success'
            })
        })
    }

    if (column.type === VariablesTypes.Performance) {
        return (
            <Form
                onSubmit={() => { }}
                initialValues={{ [column.name]: value }}
                render={({ form }) => (
                    <form onClick={(event) => { event.stopPropagation() }}
                        onBlur={(event) => { onSubmit(event) }}
                        className={showFeedBack.dataElement === `${currentEvent?.event}/${column.id}` && styles[showFeedBack.feedbackType]}>
                        <GenericFields
                            attribute={column}
                            disabled={false}
                            valueType={column.valueType}
                        />
                    </form>
                )}
            />
        )
    }
    return value || null;
}
