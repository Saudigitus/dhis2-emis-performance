import React, { useState } from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { type SimpleButtonsProps } from "../../../types/Buttons/SimpleButtonsProps";
import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";
import { DataStoreState } from "../../../schema/dataStoreSchema";

export default function SwitchButtonView(): React.ReactElement {
  const programConfig = useRecoilValue(ProgramConfigState)
  const dataStoreConfig = useRecoilValue(DataStoreState)
  const [selectedTerm, setSelectedTerm] = useState<object>();
  const items: SimpleButtonsProps[] = programConfig?.programStages.map(item => { return { id: item.id, label: item.displayName, type: "progarmStage" } });


  console.log(dataStoreConfig?.performance);

  return (
    <div>
      {items?.length > 3
        ? <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
        : <SimpleButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />}
    </div>
  );
}
