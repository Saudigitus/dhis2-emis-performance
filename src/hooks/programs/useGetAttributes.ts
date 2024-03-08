import { useRecoilValue } from 'recoil'
import { ProgramConfigState } from '../../schema/programSchema';
import { formatResponseTEI } from '../../utils';

function useGetAttributes() {
    const programConfiVariables = useRecoilValue(ProgramConfigState)

    return {
        attributes: formatResponseTEI(programConfiVariables)
    }
}
export { useGetAttributes }
