import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import WithPadding from "../../../../template/WithPadding";
import { TabsState } from "../../../../../schema/tabSchema";
import { TabElementsProps } from "../../../../../types/tabs/TabsTypes";
import { SelectedTabSchema } from "../../../../../types/table/SelectedTabTypes";
import TabComponent from "../../../../tabs/TabComponent";
import EnrollmentActionsButtons from '../../enrollmentButtons/EnrollmentActionsButtons';
import { useParams } from "../../../../../hooks/commons/useQueryParams";
import { DataStoreState } from "../../../../../schema/dataStoreSchema";
import { getDataStoreKeys } from "../../../../../utils";


function WorkingLists() {
  const { add, urlParamiters } = useParams()
  const { groupTab } = urlParamiters()
  const { assessment } = getDataStoreKeys()
  const [selectedValue, setSelectedValue] = useRecoilState(TabsState);

  const tabsElements = assessment?.tabGroups?.map((option) => ({
      name: option.label,
      value: option.label,
    })) ?? []

  useEffect(() => {
    if (groupTab) {
      const tab = tabsElements.find((x: any) => x.value == groupTab)
      setSelectedValue(tab as unknown as SelectedTabSchema)
    }
  }, [assessment])

  useEffect(() => {
    add("groupTab", selectedValue.value)
  }, [selectedValue])


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
