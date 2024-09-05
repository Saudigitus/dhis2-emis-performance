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
import { useGetTotalCompleted } from '../../../hooks/events/totals/useGetTotalCompleted';
import { TeiRefetch } from '../../../schema/refecthTeiSchema';

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig = useRecoilValue(ProgramConfigState)
    const programStageDataElements: programStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.registration.programStage)?.programStageDataElements
    const { initialize } = initializeRulesEngine()
    const { tab, orgUnit } = urlParamiters()
    const [totals, setTotals] = useState<any>({ Total: 0, COMPLETED: 0 });
    const { getTotals } = useGetTotalCompleted({ setTotals })
    const refetch = useRecoilValue<boolean>(TeiRefetch)
    const percent = ((100 * totals.COMPLETED) / totals.Total).toFixed(0)

    useEffect(() => {
        if (orgUnit)
            void getTotals()
    }, [orgUnit, refetch, tab])

    useEffect(() => {
        initialize()
    }, [])

    return (
        <nav className={style.nav}>
            <div className={style.MainHeaderContainer}>
                {headBarData(selectedOptions, getDataStoreData, programStageDataElements).map(headerItem => (
                    <HeaderItem disabled={headerItem.disabled} key={headerItem.id} id={headerItem.id} dataElementId={headerItem.dataElementId} component={headerItem.component} placeholder={headerItem.placeholder} label={headerItem.label} value={headerItem.value} selected={headerItem.selected} />
                ))}
            </div>

            <div className={style.percentContainer}>
                <div className={style.totals}>
                    <span>Registados: {totals.Total ?? 0}</span>
                    <span>Completos: &nbsp;{totals.COMPLETED ?? 0}</span>
                </div>
                <div className={style.percent}>
                    {percent === 'NaN' ? 0 : percent}%
                </div>
            </div>
        </nav>
    )
}
