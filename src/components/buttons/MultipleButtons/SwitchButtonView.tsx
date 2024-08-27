import React, { useEffect } from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { useRecoilState } from "recoil";
import { TermMarksState } from "../../../schema/termMarksSchema";
import { useGetProgramStageTerms, useParams } from "../../../hooks";
import { TermMarksConfig } from "../../../types/terms/TermMarksConfig";

export default function SwitchButtonView(): React.ReactElement {
  const { useQuery } = useParams()
  const { items } = useGetProgramStageTerms()
  const programStage = useQuery().get('programStage')
  const [selectedTerm, setSelectedTerm] = useRecoilState(TermMarksState);

  useEffect(() => {
    if (programStage) {
      const term: TermMarksConfig = items?.find((x: any) => x.id == programStage)
      setSelectedTerm(term)
    }

    return (() => {
      setSelectedTerm({ id: '', label: '', programStage: '', programIndicators:[] })
    })
  }, [programStage])

  return (
    <div>
      {items?.length > 4
        ? <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
        : <SimpleButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />}
    </div>
  );
}
