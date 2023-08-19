import React from 'react'
import { VariablesTypes, type CustomAttributeProps } from '../../../../types/table/AttributeColumns';
import { Form } from 'react-final-form';
import GenericFields from '../../../genericFields/GenericFields';

function showFieldsBasedValueType(column: CustomAttributeProps, value: string) {
    // console.log(value)
    if (column.type === VariablesTypes.DataElement) {
        return (
            <Form 
                onSubmit={() => { alert("") }} 
                initialValues={{[column.name]:value}} 
                render={({
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
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