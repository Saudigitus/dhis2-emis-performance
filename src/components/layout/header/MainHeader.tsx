import React from 'react'
import style from "./MainHeader.module.css"
import HeaderItem from './HeaderItem'
import { useParams } from '../../../hooks'
import { getSelectedKey, headBarData } from '../../../utils';

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey()

    return (
        <nav className={style.MainHeaderContainer}>
            {headBarData(selectedOptions, getDataStoreData).map(haderItem => (
                <HeaderItem key={haderItem.id} id={haderItem.id} dataElementId={haderItem.dataElementId} component={haderItem.component} placeholder={haderItem.placeholder} label={haderItem.label} value={haderItem.value} />
            ))}
        </nav>
    )
}
