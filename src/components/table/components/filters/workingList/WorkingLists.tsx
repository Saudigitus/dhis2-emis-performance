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
  const { tab } = urlParamiters()
  const { assessment } = getDataStoreKeys()
  const { items } = useGetProgramStageTerms()
  const { tabsElements } = useGetTabsElements()
  const [selectedValue, setSelectedValue] = useRecoilState(TabsState);
  const [, setSelectedTerm] = useRecoilState(SubTabState);

  useEffect(() => {
    const selectedTab = tabsElements.find((x: any) => x.value == tab) ?? tabsElements[0]
    setSelectedValue(selectedTab as unknown as SelectedTabSchema)
  }, [assessment])

  useEffect(() => {
    if (selectedValue?.value) {
      add("tab", selectedValue?.value)
    }
  }, [selectedValue])

  useEffect(() => {
    setSelectedTerm(items[0])
  }, [tab])


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
