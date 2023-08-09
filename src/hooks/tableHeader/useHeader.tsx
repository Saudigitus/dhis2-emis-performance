import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse } from "../../utils/table/header/formatResponse";
import { type ProgramConfig } from "../../types/programConfig/ProgramConfig";
import { TermMaksState } from "../../schema/termMarksSchema";

export function useHeader() {
    const programConfigState = useRecoilValue(ProgramConfigState) as ProgramConfig;
    const [columnHeader, setcolumnHeader] = useState()
    const termMarksState = useRecoilValue(TermMaksState)

    return {
        columns: formatResponse(programConfigState, termMarksState?.id),
        columnHeader,
        setcolumnHeader
    }
}
