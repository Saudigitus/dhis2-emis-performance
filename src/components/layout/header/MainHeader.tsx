import React, { useEffect, useState } from 'react'
import style from "./MainHeader.module.css"
import HeaderItem from './HeaderItem'
import { useParams } from '../../../hooks'
import { getSelectedKey, headBarData } from '../../../utils';
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig';
import { programStageDataElements } from '../../../types/programStageConfig/ProgramStageConfig';
import { ProgramConfigState } from '../../../schema/programSchema';
import { useRecoilValue } from 'recoil';
import { initializeRulesEngine } from '../../../hooks/programRules/rules-engine/InitializeRulesEngine';
import { useGtTotals } from '../../../hooks/getTotals/useGetTotals';

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig = useRecoilValue(ProgramConfigState)
    const programStageDataElements: programStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.monitoria.programStage)?.programStageDataElements
    const { initialize } = initializeRulesEngine()
    const [totals, setTotals] = useState<any>({})
    const { getTotals } = useGtTotals({ setTotals })
    const percentagem = (100 * totals?.formados / totals?.grupos).toFixed(0)

    useEffect(() => {
        initialize()
    }, [])

    useEffect(() => {
        if (selectedOptions.moduloAdministrativo)
            void getTotals()
    }, [selectedOptions.moduloAdministrativo])

    return (
        <nav className={style.nav}>
            <div className={style.MainHeaderContainer}>
                {headBarData(selectedOptions, getDataStoreData, programStageDataElements).map(headerItem => (
                    <HeaderItem disabled={headerItem.disabled} key={headerItem.id} id={headerItem.id} dataElementId={headerItem.dataElementId} component={headerItem.component} placeholder={headerItem.placeholder} label={headerItem.label} value={headerItem.value} selected={headerItem.selected} />
                ))}
            </div>

            <div className={style.percentContainer}>
                <div className={style.totals}>
                    <span>Formados: {totals?.formados ?? 0}</span>
                    <span>Grupos: &nbsp;&nbsp; &nbsp; {totals?.grupos ?? 0} </span>
                </div>
                <div className={style.percent}>
                    {percentagem == 'NaN' ? 0 : percentagem}%
                </div>
            </div>
        </nav>
    )
}
