import React, { useEffect, useState } from 'react'
import style from "./MainHeader.module.css"
import HeaderItem from './HeaderItem'
import { useParams } from '../../../hooks'
import { getSelectedKey, headBarData } from '../../../utils';
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig';
import { ProgramConfigState } from '../../../schema/programSchema';
import { useRecoilValue } from 'recoil';
import { initializeRulesEngine } from '../../../hooks/programRules/rules-engine/InitializeRulesEngine';
import { useGetTotalCompleted } from '../../../hooks/events/totals/useGetTotalCompleted';
import { TeiRefetch } from '../../../schema/refecthTeiSchema';
import { useFormatDataStore } from '../../../hooks/dataStore/useFormatDataStore';

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig[] = useRecoilValue(ProgramConfigState)
    // const programStageDataElements: programStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.registration.programStage)?.programStageDataElements
    const { initialize } = initializeRulesEngine()
    const { tab, orgUnit, program } = urlParamiters()
    const [totals, setTotals] = useState<any>({ Total: 0, COMPLETED: 0 });
    const { getTotals } = useGetTotalCompleted({ setTotals })
    const refetch = useRecoilValue<boolean>(TeiRefetch)
    const percent = ((100 * totals.COMPLETED) / totals.Total).toFixed(0)
    const { programs } = useFormatDataStore()
    const filterContent = programConfig?.filter(x => programs?.map(x => x?.program).includes(x.id))?.map(x => { return { value: x.id, label: x.displayName } })

    useEffect(() => {
        if (orgUnit && program)
            void getTotals()
    }, [orgUnit, refetch, tab, program])

    useEffect(() => {
        initialize()
    }, [])

    return (
        <nav className={style.nav}>
            <div className={style.MainHeaderContainer}>
                {headBarData(selectedOptions, getDataStoreData, filterContent as unknown as any).map(headerItem => (
                    <HeaderItem
                        disabled={headerItem.disabled}
                        key={headerItem.id}
                        id={headerItem.id}
                        dataElementId={headerItem.dataElementId}
                        component={headerItem.component}
                        placeholder={headerItem.placeholder}
                        label={headerItem.label}
                        value={headerItem.value}
                        selected={headerItem.selected}
                        options={headerItem?.options}
                    />
                ))}
            </div>

            <div className={style.percentContainer}>
                <span style={{ display: "flex", alignItems: "center" }}>{programConfig?.find(x => x.id == program)?.programStages?.find(x => x.id == tab)?.displayName
                }</span>

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
