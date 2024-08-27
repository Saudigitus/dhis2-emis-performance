import React from "react";
import { TabBar, Tab } from "@dhis2/ui";
import { useParams } from "../../hooks";
import WithPadding from "../template/WithPadding";
import { type TabBarProps } from "../../types/tabs/TabsTypes";

function TabComponent(props: TabBarProps): React.ReactElement {
  const { add } = useParams()
  const { elements, selectedValue, setSelectedValue } = props;

  return (
    <TabBar fixed>
      {elements.map((element, i) => (
        <Tab
          key={i}
          selected={selectedValue.value === element.value}
          onClick={() => {
            setSelectedValue(element);
            add("groupTab", element.value)
          }}
        >
          <WithPadding p="7px">{element.name} </WithPadding>
        </Tab>
      ))}
    </TabBar>
  );
}

export default TabComponent;
