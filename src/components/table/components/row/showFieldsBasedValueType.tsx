import React from 'react'
import { type CustomAttributeProps, VariablesTypes } from '../../../../types/variables/AttributeColumns';
import { Form } from 'react-final-form';
import GenericFields from '../../../genericFields/GenericFields';
import styles from "./row.module.css"
import { type ShowFieldsBasedValueTypeProps } from '../../../../types/table/TableContentProps';
import { getDisplayName } from '../../../../utils';
import { Attribute } from '../../../../types/generated/models';
import { formatKeyValueTypeHeader } from '../../../../utils/programRules/formatKeyValueType';
import { GetImageUrl } from '../../../../utils/table/rows/getImageUrl';
import { IconButton } from '@material-ui/core';
import CropOriginal from '@material-ui/icons/CropOriginal';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../../../schema/programSchema';
import { IconCheckmark24 } from "@dhis2/ui"
import { RemoveCircleOutline } from '@material-ui/icons';

export default function ShowFieldsBasedValueType(props: ShowFieldsBasedValueTypeProps) {
    const { column, value, currentEvent, saveMarks, showFeedBack, setShowFeedBack, headers, loader, trackedEntity, prevValues, setPrevValues, inactive } = props;
    const dataElement = column.id.split('_')[0]
    const { imageUrl } = GetImageUrl()
    const programConfigState = useRecoilValue(ProgramConfigState);

    function save(newMark: any) {
        void saveMarks({
            data: {
                event: currentEvent?.event,
                orgUnit: currentEvent?.orgUnit,
                enrollment: currentEvent?.enrollment,
                dataValues: [{
                    dataElement,
                    value: newMark
                }],
                program: currentEvent?.program,
                status: currentEvent?.status,
                trackedEntity: currentEvent?.trackedEntity,
                programStage: currentEvent?.programStage
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
                            disabled={((loader === true) || inactive)}
                            valueType={column.valueType}
                        />
                    </form>
                )}
            />
        )
    }

    if (column.type === VariablesTypes.HasEvent) {
        return (
            <>
                {
                    value ?
                        <IconCheckmark24 />
                        :
                        <RemoveCircleOutline />

                }
            </>
        )
    }

    if (column.valueType === Attribute.valueType.IMAGE as unknown as CustomAttributeProps["valueType"] ||
        column.valueType === Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] &&
        (column.type === VariablesTypes.Attribute || column.type === VariablesTypes.DataElement)) {
        return (
            <span>
                {
                    formatKeyValueTypeHeader(headers)[column.id] === Attribute.valueType.IMAGE
                        ? <a href={imageUrl({ attribute: column.id, trackedEntity })} target='_blank' rel="noreferrer">{value && <IconButton> <CropOriginal /></IconButton>}</a>
                        :
                        // getDisplayName({ attribute: column.id, value, headers })
                        getDisplayName({ metaData: column.id, value, program: programConfigState })
                }
            </span>
        )
    }
    return value || null;
}
