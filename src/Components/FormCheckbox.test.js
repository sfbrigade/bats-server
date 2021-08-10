import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import FormCheckbox from './FormCheckbox';

test('Snapshot', () => {
  const component = renderer.create(
    <FormCheckbox
      currentValue="apple"
      label="banana"
      onChange={() => {}}
      property="banana"
      value={true}
    />);

    const componentJson = component.toJSON();
    expect(componentJson).toMatchSnapshot();
});

test('FormInput should trigger the onChange callback', () => {
  const mock = jest.fn();

  const wrapper = render(
    <FormCheckbox
      currentValue="apple"
      label="Coconut"
      onChange={mock}
      property="coconut"
      value={true}
    />);

    const checkbox = wrapper.getByLabelText('Coconut');
    fireEvent.click(checkbox);
    expect(mock.mock.calls.length).toBe(1);
})