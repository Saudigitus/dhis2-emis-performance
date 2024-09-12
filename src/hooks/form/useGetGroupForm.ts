import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { formatResponseDataElements } from '../../utils/events/formatResponseDataElements';
import { programStageDataElements, ProgramStageSectionConfig } from '../../types/programStageConfig/ProgramStageConfig';

export default function useGetGroupForm() {
    const { getDataStoreData } = getSelectedKey()
    const getProgram = useRecoilValue(ProgramConfigState);

    const buildForm = (programStage: string) => {
        if (Object.keys(getDataStoreData)?.length && getProgram) {
            const dataElements = getAllDataElements(programStage) as programStageDataElements[]
            const mapeamentoProgramStage = getProgram.programStages 
                .find((x) => x.id === programStage)
                ?.programStageSections
                .map((x) => {
                    return {
                        ...x,
                        fields: formatResponseDataElements(x.dataElements, dataElements)
                    }
                })!

            return mapeamentoProgramStage
        }
    }


    function getAllDataElements(programStage: string) {
        if (Object.keys(getDataStoreData)?.length && getProgram) {
            const mapeamentoProgramStage = getProgram.programStages.find((x) => x.id === programStage)

            const allDataElments = mapeamentoProgramStage?.programStageDataElements
            return allDataElments

        }
    }


    return { buildForm, getAllDataElements }
}
