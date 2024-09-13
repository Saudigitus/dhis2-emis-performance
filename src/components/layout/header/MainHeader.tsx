import React, { useEffect } from 'react'
import style from "./MainHeader.module.css"
import HeaderItem from './HeaderItem'
import { useParams } from '../../../hooks'
import { getSelectedKey, headBarData } from '../../../utils';
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig';
import { programStageDataElements } from '../../../types/programStageConfig/ProgramStageConfig';
import { ProgramConfigState } from '../../../schema/programSchema';
import { useRecoilValue } from 'recoil';
import { initializeRulesEngine } from '../../../hooks/programRules/rules-engine/InitializeRulesEngine';
import { Button } from "@dhis2/ui";
import { useNavigate } from 'react-router-dom';

export default function MainHeader(): React.ReactElement {
    const navigate = useNavigate()
    const { urlParamiters } = useParams();
    const selectedOptions = urlParamiters();
    const { teiOU, tei, enrollment } = urlParamiters()
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig = useRecoilValue(ProgramConfigState)
    const programStageDataElements: programStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.registration.programStage)?.programStageDataElements
    const { initialize } = initializeRulesEngine()

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

            {(teiOU || tei || enrollment) && <Button onClick={() => navigate(-1)} className={style.btn} small>Voltar</Button>}
        </nav>
    )
}
