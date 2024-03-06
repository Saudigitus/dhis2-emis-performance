import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { TermMarksState } from "../../schema/termMarksSchema";
import { formatResponse } from "../../utils";

export function useHeader() {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const termMarksState = useRecoilValue(TermMarksState)

    return {
        columns: formatResponse(programConfigState, termMarksState?.id)
    }
}
