import { useRecoilValue, useRecoilState } from "recoil"
import { TermMarksState } from "../../schema/termMarksSchema";
import { DataStoreState } from "../../schema/dataStoreSchema";
import { useEffect } from "react";
import { useParams } from "../commons/useQueryParams";
import { ProgramConfigState } from "../../schema/programSchema";

export function useGetInitialValues() {
    const [, setSelectedTerm] = useRecoilState(TermMarksState)
    const dataStoreState = useRecoilValue(DataStoreState);
    const programConfig = useRecoilValue(ProgramConfigState);

    const { add } = useParams()

    useEffect(() => {
        add("programStage", dataStoreState?.find(section => section.key === "student")?.performance.programStages[0].programStage);
        setSelectedTerm({
            id: dataStoreState?.find(section => section.key === "student")?.performance.programStages[0].programStage,
            label: programConfig?.programStages.find(pStage => pStage.id === dataStoreState?.find(section => section.key === "student")?.performance.programStages[0].programStage)?.displayName,,
            type: "programStage"
        })
    }, [])
}
