import React from 'react'
import style from "./MainHeader.module.css"
import HeaderItem from './HeaderItem'
import { useParams } from '../../../hooks'
import { getSelectedKey, headBarData } from '../../../utils';
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig';
import { programStageDataElements } from '../../../types/programStageConfig/ProgramStageConfig';
import { ProgramConfigState } from '../../../schema/programSchema';
import { useRecoilValue } from 'recoil';

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey()
    const programConfig : ProgramConfig = useRecoilValue(ProgramConfigState)
    const programStageDataElements : programStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.registration.programStage)?.programStageDataElements


    return (
        <nav className={style.MainHeaderContainer}>
            {headBarData(selectedOptions, getDataStoreData, programStageDataElements).map(headerItem => (
                <HeaderItem key={headerItem.id} id={headerItem.id} dataElementId={headerItem.dataElementId} component={headerItem.component} placeholder={headerItem.placeholder} label={headerItem.label} value={headerItem.value} selected={headerItem.selected} />
            ))}
        </nav>
    )
}
