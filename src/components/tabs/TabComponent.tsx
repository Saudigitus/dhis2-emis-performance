import React from "react";
import { TabBar, Tab } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import { type TabBarProps } from "../../types/tabs/TabsTypes";
import { Badge } from "@material-ui/core";

function TabComponent(props: TabBarProps): React.ReactElement {
  const { elements, selectedValue, setSelectedValue, totals } = props;

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
            <Badge max={10000} badgeContent={totals[element.name] ?? 0} color="primary" style={{ margin: "-2px 0 0 30px" }} />
          </WithPadding>
        </Tab>
      ))
      }
    </TabBar >
  );
}

export default TabComponent;
