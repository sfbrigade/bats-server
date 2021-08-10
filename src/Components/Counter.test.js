import React from 'react';
import renderer from 'react-test-renderer';
import Counter from './Counter';

test('Snapshot', () => {
  const component = renderer.create(
    <Counter
      label="Behavioral Beds"
      name="psychBedsCount"
      min={0}
      onChange={() => {}}
      value='val'
    />);

    const componentJson = component.toJSON();
    expect(componentJson).toMatchSnapshot();
});
