import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import WithPadding from "../../../../template/WithPadding";
import { TabsState } from "../../../../../schema/tabSchema";
import { SelectedTabSchema } from "../../../../../types/table/SelectedTabTypes";
import TabComponent from "../../../../tabs/TabComponent";
import { useParams } from "../../../../../hooks/commons/useQueryParams";
import { getDataStoreKeys } from "../../../../../utils";
import { SubTabState } from "../../../../../schema/termMarksSchema";
import { useGetProgramStageTerms } from "../../../../../hooks";
import { useGetTabsElements } from "../../../../../utils/tabs/tabsElements";
import { useGetTotalCompleted } from "../../../../../hooks/events/totals/useGetTotalCompleted";
import { TeiRefetch } from "../../../../../schema/refecthTeiSchema";

function WorkingLists() {
  const { add, urlParamiters } = useParams()
  const { tab, orgUnit } = urlParamiters()
  const { assessment } = getDataStoreKeys()
  const { items } = useGetProgramStageTerms()
  const { tabsElements } = useGetTabsElements()
  const [selectedValue, setSelectedValue] = useRecoilState(TabsState);
  const [totals, setTotals] = useState<any>({});
  const [, setSelectedTerm] = useRecoilState(SubTabState);
  const { getTotals } = useGetTotalCompleted({ setTotals })
  const [refetch,] = useRecoilState<boolean>(TeiRefetch)

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
      </div>
    </WithPadding>
  )
}

export default WorkingLists
