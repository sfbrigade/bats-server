import React from 'react';
import renderer from 'react-test-renderer';
import TabBar from './TabBar';

test('Snapshot', () => {
  const component = renderer.create(
    <TabBar
      onSelect={() => {}}
      selectedTab={1}
      tabs={['Ringdown', 'Hospital Info']}
    />
  );

    const componentJson = component.toJSON();
    expect(componentJson).toMatchSnapshot();
});