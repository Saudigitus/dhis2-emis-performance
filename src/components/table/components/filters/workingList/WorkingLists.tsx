import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import WithPadding from "../../../../template/WithPadding";
import { TabsState } from "../../../../../schema/tabSchema";
import { TabElementsProps } from "../../../../../types/tabs/TabsTypes";
import { SelectedTabSchema } from "../../../../../types/table/SelectedTabTypes";
import TabComponent from "../../../../tabs/TabComponent";
import { useParams } from "../../../../../hooks/commons/useQueryParams";
import { getDataStoreKeys } from "../../../../../utils";
import { SubTabState } from "../../../../../schema/termMarksSchema";
import { useGetProgramStageTerms } from "../../../../../hooks";
import { useGetTabsElements } from "../../../../../utils/tabs/tabsElements";
import EnrollmentActionsButtons from "../../enrollmentButtons/EnrollmentActionsButtons";


function WorkingLists() {
  const { add, urlParamiters, remove } = useParams()
  const { groupTab } = urlParamiters()
  const { assessment } = getDataStoreKeys()
  const { items } = useGetProgramStageTerms()
  const { tabsElements } = useGetTabsElements()
  const [selectedValue, setSelectedValue] = useRecoilState(TabsState);
  const [, setSelectedTerm] = useRecoilState(SubTabState);

  useEffect(() => {
    const tab = tabsElements.find((x: any) => x.value == groupTab) ?? tabsElements[0]
    setSelectedValue(tab as unknown as SelectedTabSchema)
  }, [assessment])

  useEffect(() => {
    add("groupTab", selectedValue.value)
  }, [selectedValue])

  useEffect(() => {
    setSelectedTerm(items[0])
    // if (items[0]?.programStage)
    //   add("programStage", items[0]?.id)
    // else
    //   remove("programStage")
  }, [groupTab])


  return (
    <WithPadding>
      <div className="d-flex justify-content-between align-items-center">
        <TabComponent
          elements={tabsElements}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />

        {/* <WithPadding p="10px">
          <EnrollmentActionsButtons />
        </WithPadding> */}

      </div>
    </WithPadding>
  )
}

export default WorkingLists
