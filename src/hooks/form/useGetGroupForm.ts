import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponseEvents } from '../../utils/events/formatResponseEvents';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { DataStoreState } from '../../schema/dataStoreSchema';

export default function useGetGroupForm() {
    const { getDataStoreData } = getSelectedKey()
    const [formData, setformData] = useState<any[]>([])
    const getDataStore = useRecoilValue(DataStoreState);
    const getProgram = useRecoilValue(ProgramConfigState);

    const buildForm = () => {
        if (Object.keys(getDataStoreData)?.length && getProgram) {
            const mapeamentoProgramStage = getProgram.programStages.find((x) => x.id === getDataStore[0]?.assessment.tabGroups?.[0].programStage)

            setformData([formatResponseEvents(mapeamentoProgramStage)])
        }
    }
    useEffect(() => {
        buildForm()
    }, [])

    return { formData }
}
