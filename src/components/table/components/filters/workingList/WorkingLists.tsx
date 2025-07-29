import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import WithPadding from "../../../../template/WithPadding";
import { TabsState } from "../../../../../schema/tabSchema";
import { SelectedTabSchema } from "../../../../../types/table/SelectedTabTypes";
import TabComponent from "../../../../tabs/TabComponent";
import { useParams } from "../../../../../hooks/commons/useQueryParams";
import { SubTabState } from "../../../../../schema/termMarksSchema";
import { useGetProgramStageTerms } from "../../../../../hooks";
import { useGetTabsElements } from "../../../../../utils/tabs/tabsElements";
import { useGetTotalCompleted } from "../../../../../hooks/events/totals/useGetTotalCompleted";
import { TeiRefetch } from "../../../../../schema/refecthTeiSchema";
import { TabListSchema } from "../../../../../schema/tabListSchemma";

function WorkingLists() {
  const { add, urlParamiters } = useParams()
  const { tab, orgUnit, program } = urlParamiters()
  const { items } = useGetProgramStageTerms()
  const { tabsElements } = useGetTabsElements()
  const [selectedValue, setSelectedValue] = useRecoilState(TabsState);
  const setTabState = useSetRecoilState(TabListSchema)
  const [totals, setTotals] = useState<any>({});
  const [, setSelectedTerm] = useRecoilState(SubTabState);
  const { getTotalToAllStage } = useGetTotalCompleted({ setTotals })
  const [refetch,] = useRecoilState<boolean>(TeiRefetch)

  useEffect(() => {
    const selectedTab = tabsElements.find((x: any) => x.value == tab) ?? tabsElements[0]
    setSelectedValue(selectedTab as unknown as SelectedTabSchema)
    setTabState(tabsElements)
  }, [program])

  useEffect(() => {
    if (selectedValue?.value) {
      add("tab", selectedValue?.programStage)
    }
  }, [selectedValue])

  useEffect(() => {
    setSelectedTerm(items[0])
  }, [tab])

  useEffect(() => {
    if (orgUnit && program) {
      setTotals({})
      void getTotalToAllStage()
    }
  }, [orgUnit, refetch, program])

  return (
    <WithPadding>
      <div style={{ marginBottom: "-9px" }} className="d-flex justify-content-between align-items-center">
        <TabComponent
          elements={tabsElements}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          totals={totals}
        />
      </div>
    </WithPadding>
  )
}

export default WorkingLists
