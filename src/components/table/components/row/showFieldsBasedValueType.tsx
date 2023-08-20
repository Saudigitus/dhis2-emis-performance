import React from 'react'
import { VariablesTypes, type CustomAttributeProps } from '../../../../types/table/AttributeColumns';
import { Form } from 'react-final-form';
import GenericFields from '../../../genericFields/GenericFields';

function showFieldsBasedValueType(column: CustomAttributeProps, value: string, currentEvent: object, saveMarks: any) {
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
        })
    }

    if (column.type === VariablesTypes.DataElement) {
        return (
            <Form
                onSubmit={() => { }}
                initialValues={{ [column.name]: value }}
                render={({ handleSubmit }) => (
                    <form onBlur={(event) => { onSubmit(event) }}>
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
    return value;
}

export default showFieldsBasedValueType