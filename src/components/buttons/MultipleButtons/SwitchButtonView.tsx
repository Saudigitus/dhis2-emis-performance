import React, { useState } from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { type SimpleButtonsProps } from "../../../types/Buttons/SimpleButtonsProps";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";
import { DataStoreState } from "../../../schema/dataStoreSchema";
import { TermMaksState } from "../../../schema/termMarksSchema";

export default function SwitchButtonView(): React.ReactElement {
  const programConfig = useRecoilValue(ProgramConfigState)
  const dataStoreConfig = useRecoilValue(DataStoreState)
  const [selectedTerm, setSelectedTerm] = useRecoilState(TermMaksState);
  const items: SimpleButtonsProps[] = dataStoreConfig?.find(dta => dta.key === "student")?.performance?.programStages.map(x => { return { id: x.programStage, label: programConfig?.programStages.find(pStage => pStage.id === x.programStage)?.displayName, type: "progarmStage" } }) ?? [];

  return (
    <div>
      {items?.length > 3
        ? <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
        : <SimpleButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />}
    </div>
  );
}
