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
            {headBarData(selectedOptions, getDataStoreData).map(headerItem => (
                <HeaderItem key={headerItem.id} id={headerItem.id} dataElementId={headerItem.dataElementId} component={headerItem.component} placeholder={headerItem.placeholder} label={headerItem.label} value={headerItem.value} selected={headerItem.selected} />
            ))}
        </nav>
    )
}
