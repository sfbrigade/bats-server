import React, { useState } from 'react';
import TabBar from '../Components/TabBar';

const metadata = {
  component: TabBar,
  decorators: [
    (Story) => (
      <div style={{ width: '50%' }}>
        <Story />
      </div>
    ),
  ],
};

export default metadata;

function story(args = {}, Component = metadata.component) {
  const func = (args) => {
    // since func() isn't a component, we can't call a hook from inside it.  so create a functional component to
    // contain the state hook and render the TabBar
    function Header() {
      const [selectedTab, setSelectedTab] = useState(args.selectedTab);

      return (
        <Component
          {...args}
          selectedTab={selectedTab}
          onSelect={(tab) => {
            setSelectedTab(tab);
            args.onSelect(tab);
          }}
        />
      );
    }

    return <Header />;
  };

  func.args = args;

  return func;
}

export const EMS = story({
  tabs: [
    { label: 'Ringdown', id: 'ringdown' },
    { label: 'Hospital Info', id: 'hospitalInfo' },
  ],
  selectedTab: 'ringdown',
});
