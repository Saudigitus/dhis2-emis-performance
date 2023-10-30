import React from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { type SimpleButtonsProps } from "../../../types/Buttons/SimpleButtonsProps";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";
import { TermMarksState } from "../../../schema/termMarksSchema";
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";

export default function SwitchButtonView(): React.ReactElement {
  const programConfig = useRecoilValue(ProgramConfigState)
  const [selectedTerm, setSelectedTerm] = useRecoilState(TermMarksState);
  const { getDataStoreData } = getSelectedKey()

  const items: SimpleButtonsProps[] = getDataStoreData.performance.programStages.map(x => {
    return {
      id: x.programStage,
      label: programConfig?.programStages.find(pStage => pStage.id === x.programStage)?.displayName,
      type: "programStage"
    }
  }) ?? [];

  return (
    <div>
      {items?.length > 3
        ? <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
        : <SimpleButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />}
    </div>
  );
}
