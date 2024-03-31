import React, { useState } from 'react'
import style from "./MainHeader.module.css"
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import { type HeadBarTypes } from '../../../types/headBar/HeadBarTypes'
import info from "../../../assets/images/headbar/info.svg"
import { SimpleSearch } from '../../search'
import classNames from 'classnames'
import { componentMapping } from '../../../utils'
import { useDataElementsParamMapping, useParams } from '../../../hooks'
import { useRecoilState } from 'recoil'
import { OuQueryString } from '../../../schema/headerSearchInputSchema'
import HeaderResetItemValue from './HeaderResetItemValue'
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey'

export default function HeaderItem(props: HeadBarTypes): React.ReactElement {
    const { label, value, placeholder, component, dataElementId, id, selected, disabled } = props;
    const { remove } = useParams()
    const Component = (component != null) ? componentMapping[component] : null;
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const [, setStringQuery] = useRecoilState(OuQueryString);
    const { getDataStoreData } = getSelectedKey()

    const onToggle = () => {
        setStringQuery(undefined)
        setOpenDropDown(!openDropDown)
    }

    const paramsMapping = useDataElementsParamMapping()

    const onReset = () => {
        if (dataElementId)
            remove(paramsMapping[dataElementId as unknown as keyof typeof paramsMapping])
        else
            if (id === "c540ac7c") {
                remove("school");
                remove("schoolName");
            }
    }

    return (
        <DropdownButton
            disabled={disabled}
            open={openDropDown}
            onClick={onToggle}
            className={classNames(style.HeaderItemContainer, style[id])}
            component={
                < FlyoutMenu >
                    <SimpleSearch id={id} placeholder={placeholder}>
                        {(Component != null) && <Component dataElementId={dataElementId} onToggle={onToggle} />}
                    </SimpleSearch>
                </FlyoutMenu >
            }
        >
            <h5>{label} <span>{value}</span></h5>
            {(selected && dataElementId !== getDataStoreData?.registration?.academicYear) ? <HeaderResetItemValue onReset={onReset} /> : null}
            <img src={info} />
        </DropdownButton >
    )
}
