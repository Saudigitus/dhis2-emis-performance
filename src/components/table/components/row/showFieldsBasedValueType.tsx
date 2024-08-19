import React, { useState, useEffect } from 'react'
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
import { CustomDhis2RulesEngine } from '../../../../hooks/programRules/rules-engine/RulesEngine';
import Tooltip from "@material-ui/core/Tooltip";

export default function ShowFieldsBasedValueType(props: ShowFieldsBasedValueTypeProps) {
    const { column, value, currentEvent, saveMarks, showFeedBack, setShowFeedBack, headers, loader, trackedEntity, prevValues, setPrevValues, inactive } = props;
    const dataElement = column.id.split('_')[0]
    const { imageUrl } = GetImageUrl()
    const programConfigState = useRecoilValue(ProgramConfigState);
    const [values, setValues] = useState<Record<string, string>>({})
    const { name, ...rest } = column
    const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({ variables: [{ ...rest, name: dataElement }], values: values, type: "programStage", formatKeyValueType: { [dataElement]: column.valueType } })

    useEffect(() => {
        runRulesEngine()
    }, [values])

    useEffect(() => {
        if (Object.keys(values).length === 0)
            setValues({ [dataElement]: value })
    }, [])


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
        if (event.target.value && prevValues[column.id] !== event.target.value) {
            setValues({ [dataElement]: event.target.value })
            setPrevValues((prevValues: any) => ({ ...prevValues, [column.id]: event?.target?.value }))
            save(event.target.value)
        }
    }

    if (column.type === VariablesTypes.Performance) {
        return (
            <Form
                onSubmit={() => { }}
                initialValues={{ [dataElement]: value }}
                render={({ pristine }) => (
                    <form onClick={(event) => { event.stopPropagation() }}
                        onBlur={(event) => { onSubmit(event, pristine) }}
                        className={showFeedBack.dataElement === `${currentEvent?.event}/${dataElement}` && styles[showFeedBack.feedbackType]}>
                        <Tooltip arrow={true} title={updatedVariables[0].content}>
                            <>
                                <GenericFields
                                    attribute={updatedVariables[0]}
                                    disabled={((loader === true) || inactive)}
                                    valueType={column.valueType}
                                />
                                <span className={styles.content}>
                                    {updatedVariables[0].content}
                                </span>
                            </>
                        </Tooltip>
                    </form>
                )}
            />
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
