import { useSetRecoilState, useRecoilValue } from "recoil"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { paramsMapping } from "../../utils/commons/paramsMapping";
import { useLocation } from "react-router-dom";
import { TermMarksState } from "../../schema/termMarksSchema";
import { ProgramConfigState } from "../../schema/programSchema";

export function useGetInitialValues() {
    const location = useLocation()
    const setHeaderFields = useSetRecoilState(HeaderFieldsState)
    const setSelectedTerm = useSetRecoilState(TermMarksState)
    const programConfig = useRecoilValue(ProgramConfigState)
    const entries = location?.search?.split('?')?.[1]?.split('&')?.map((item) => item.split('='))
    const dataElementsQuerybuilder = []
    if (entries?.length > 0) {
        for (const [key, value] of entries) {
            const keys = Object.entries(paramsMapping)
            for (const [dataElement, name] of keys) {
                if (name.includes(key)) {
                    dataElementsQuerybuilder.push(`${dataElement}:in:${value.replace("+", " ")}`)
                }
            }

            if(key === "programStage") {
                setSelectedTerm({
                    id: key,
                    label: programConfig?.programStages.find(pStage => pStage.id === key)?.displayName,
                    type: "programStage"
                })
            }
        }
        setHeaderFields({
            attributes: [],
            dataElements: dataElementsQuerybuilder
        })
    }
}
