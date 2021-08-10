import React from 'react';
import renderer from 'react-test-renderer';
import Alert from './Alert';

test('Snapshot', () => {
  const component = renderer.create(
    <Alert
      type="warning"
      title="Update divert status?"
      message="Ambulances will be notified."
      cancel="Keep status"
      destructive="Update status"
      onDestructive={() => {}}
      onCancel={() => {}}
    />);

    const componentJson = component.toJSON();
    expect(componentJson).toMatchSnapshot();
});