import React from "react";
import { TabBar, Tab } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import { type TabBarProps } from "../../types/tabs/TabsTypes";

function TabComponent(props: TabBarProps): React.ReactElement {
  const { elements, selectedValue, setSelectedValue } = props;

  return (
    <TabBar fixed>
      {elements.map((element, i) => (
        <Tab
          key={i}
          selected={selectedValue.value === element.value}
          onClick={() => {
            setSelectedValue(element);
          }}
        >
          <WithPadding p="7px 25px 0 25px">
            {element.name}
          </WithPadding>
        </Tab>
      ))}
    </TabBar>
  );
}

export default TabComponent;
