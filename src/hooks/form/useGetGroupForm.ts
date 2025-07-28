import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { formatResponseDataElements } from '../../utils/events/formatResponseDataElements';
import { programStageDataElements } from '../../types/programStageConfig/ProgramStageConfig';
import { useParams } from '../commons/useQueryParams';

export default function useGetGroupForm() {
    const { getDataStoreData } = getSelectedKey()
    const { urlParamiters } = useParams()
    const { program } = urlParamiters()
    const getProgram = useRecoilValue(ProgramConfigState);

    const buildForm = (programStage: string) => {
        if (Object.keys(getDataStoreData)?.length && getProgram) {
            const dataElements = getAllDataElements(programStage) as programStageDataElements[]
            const stage = getProgram?.find(x => x.id == program)?.programStages.find((x) => x.id === programStage)!
            const dataElementsGroup = stage?.programStageSections?.length > 0 ? stage?.programStageSections : [{ displayName: stage?.displayName, dataElements: stage?.programStageDataElements?.map(x => x.dataElement) }]

            const mapeamentoProgramStage = dataElementsGroup.map((x: any) => {
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
            const mapeamentoProgramStage = getProgram?.find(x => x.id == program)?.programStages.find((x) => x.id === programStage)

            const allDataElments = mapeamentoProgramStage?.programStageDataElements
            return allDataElments

        }
    }


    function getAllDataElementsToPost(programStage: string) {
        if (Object.keys(getDataStoreData)?.length && getProgram) {
            const mapeamentoProgramStage = getProgram?.find(x => x.id == program)?.programStages.find((x) => x.id === programStage)

            const allDataElments = mapeamentoProgramStage?.programStageDataElements.flatMap((x) => x.dataElement)
            return allDataElments

        }
    }

    return { buildForm, getAllDataElements, getAllDataElementsToPost }
}
