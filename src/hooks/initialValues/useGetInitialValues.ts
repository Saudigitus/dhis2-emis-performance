import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { paramsMapping } from "../../utils/commons/paramsMapping";
import { useLocation } from "react-router-dom";
import { TermMarksState } from "../../schema/termMarksSchema";
import { ProgramConfigState } from "../../schema/programSchema";
import { DataStoreState } from "../../schema/dataStoreSchema";
import { useEffect } from "react";
import { useParams } from "../commons/useQueryParams";

export function useGetInitialValues() {
    const [, setSelectedTerm] = useRecoilState(TermMarksState)
    const dataStoreState = useRecoilValue(DataStoreState);
    const { add } = useParams()

    useEffect(() => {
        add("programStage", dataStoreState?.find(section => section.key === "student")?.performance.programStages[0].programStage)
        setSelectedTerm({
            id: dataStoreState?.find(section => section.key === "student")?.performance.programStages[0].programStage,
            label: programConfig?.programStages.find(pStage => pStage.id === dataStoreState?.find(section => section.key === "student")?.performance.programStages[0].programStage)?.displayName,,
            type: "programStage"
        })
    }, [])
}
