import React from 'react'
import { CustomAttributeProps, VariablesTypes } from '../../../../types/variables/AttributeColumns';
import { Form } from 'react-final-form';
import GenericFields from '../../../genericFields/GenericFields';
import styles from "./row.module.css"
import { ShowFieldsBasedValueTypeProps } from '../../../../types/table/TableContentProps';
import { getDisplayName } from '../../../../utils';
import { Attribute } from '../../../../types/generated/models';
import { formatKeyValueTypeHeader } from '../../../../utils/programRules/formatKeyValueType';
import { GetImageUrl } from '../../../../utils/table/rows/getImageUrl';
import { IconButton } from '@material-ui/core';
import CropOriginal from '@material-ui/icons/CropOriginal';

export default function ShowFieldsBasedValueType(props: ShowFieldsBasedValueTypeProps) {
    const { column, value, currentEvent, saveMarks, showFeedBack, setShowFeedBack, headers, loader, trackedEntity, prevValues, setPrevValues } = props;
    let dataElement = column.id.split('_')[0]
    const { imageUrl } = GetImageUrl()

    function save(newMark: any) {
        void saveMarks({
            data: {
                event: currentEvent?.event,
                orgUnit: currentEvent?.orgUnit,
                dataValues: [{
                    dataElement: dataElement,
                    value: newMark
                }],
                program: currentEvent?.program,
                status: currentEvent?.status,
                trackedEntity: currentEvent?.trackedEntity,
                programStage: currentEvent?.programStage,
            },
            id: `${currentEvent?.event}/${dataElement}`
        }).then(() => {
            setShowFeedBack({
                dataElement: `${currentEvent?.event}/${dataElement}`,
                feedbackType: 'success'
            })
        })
    }

    const onSubmit = (event: any, pristine: boolean) => {
        if (event.target.value && !pristine && prevValues[column.id] !== event.target.value) {
            setPrevValues((prevValues: any) => ({ ...prevValues, [column.id]: event.target.value }))
            save(event.target.value)
        }
    }

    if (column.type === VariablesTypes.Performance) {
        return (
            <Form
                onSubmit={() => { }}
                initialValues={{ [column.name]: value }}
                render={({ pristine }) => (
                    <form onClick={(event) => { event.stopPropagation() }}
                        onBlur={(event) => { onSubmit(event, pristine) }}
                        className={showFeedBack.dataElement === `${currentEvent?.event}/${dataElement}` && styles[showFeedBack.feedbackType]}>
                        <GenericFields
                            attribute={column}
                            disabled={loader as unknown as boolean}
                            valueType={column.valueType}
                        />
                    </form>
                )}
            />
        )
    }

    if (column.valueType === Attribute.valueType.IMAGE as unknown as CustomAttributeProps["valueType"]
        || column.valueType === Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"]
        && (column.type === VariablesTypes.Attribute || column.type === VariablesTypes.DataElement)) {
        return (
            <span>
                {
                    formatKeyValueTypeHeader(headers)[column.id] === Attribute.valueType.IMAGE ?
                        <a href={imageUrl({ attribute: column.id, trackedEntity })} target='_blank'>{value && <IconButton> <CropOriginal /></IconButton>}</a>
                        :
                        getDisplayName({ attribute: column.id, value, headers })
                }
            </span>
        )
    }
    return value || null;
}
