import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponseEvents } from '../../utils/events/formatResponseEvents';
import { formatResponseTEI } from '../../utils/tei/formatResponseAttributes';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';

export default function useGetFormattedForm() {
    const [formattedFormFields, setFormattedFormFields] = useState<any[]>([])
    const getProgram = useRecoilValue(ProgramConfigState);
    const { getDataStoreData } = getSelectedKey()

    const buildForm = () => {
        if (getDataStoreData != null && getProgram !== undefined) {
            const { registration, 'socio-economics': { programStage } } = getDataStoreData
            const { programStages } = getProgram
            const enrollmentDetailProgramStage = programStages.filter(element => element.id === registration.programStage)[0]
            const socioEconomicProgramStage = programStages.filter(element => element.id === programStage)[0]
            
            setFormattedFormFields([formatResponseEvents(enrollmentDetailProgramStage), formatResponseTEI(getProgram), formatResponseEvents(socioEconomicProgramStage)])
        }
    }
    useEffect(() => {
        buildForm()
    }, [])

    return { formattedFormFields }
}
