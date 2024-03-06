import React from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { useRecoilState } from "recoil";
import { TermMarksState } from "../../../schema/termMarksSchema";
import { useGetProgramStageTerms } from "../../../hooks";

export default function SwitchButtonView(): React.ReactElement {
  const [selectedTerm, setSelectedTerm] = useRecoilState(TermMarksState);
  const { items } = useGetProgramStageTerms()

  return (
    <div>
      {items?.length > 3
        ? <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
        : <SimpleButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />}
    </div>
  );
}
