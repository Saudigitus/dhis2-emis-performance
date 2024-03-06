import React from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { SimpleButtonsType } from "../../../types/buttons/SimpleButtonsProps";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";
import { TermMarksState } from "../../../schema/termMarksSchema";
import { getSelectedKey } from "../../../utils";
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
