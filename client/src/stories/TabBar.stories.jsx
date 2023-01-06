import React, { useState } from "react";
import TabBar from "../Components/TabBar";

const metadata = {
  title: 'Routed/TabBar',
  component: TabBar,
  decorators: [
    (Story) => (
      <div style={{ width: "50%" }}>
        <Story />
      </div>
    )
  ]
};

export default metadata;

function story(args = {}, Component = metadata.component) {
	const func = (args) => <Component {...args} />;
//	const func = (args) => {
//    const [selectedTab, setSelectedTab] = useState(args.selectedTab);
//
//    return (
//      <Component
//        {...args}
//        selectedTab={selectedTab}
//        onSelect={(tab) => {
//          setSelectedTab(tab);
//          args.onSelect(tab);
//        }}
//      />
//    );
//  };

  func.args = args;

  return func;
}

export const EMS = story({
  tabs: [{ label: "Ringdown" }, { label: "Hospital Info" }],
  selectedTab: 0,
});
