import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import FormInput from './FormInput';

test('Snapshot', () => {
  const component = renderer.create(
    <FormInput
      label="Unit #"
      onChange={() => {}}
      property="ambulanceIdentifier"
      required
      size="medium"
    />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('FormInput should trigger the onChange callback', () => {
  const mock = jest.fn();

  const wrapper = render(
    <FormInput
      label="Unit"
      onChange={mock}
      property="ambulanceIdentifier"
      required
      size="medium"
    />);

    const input = wrapper.getByLabelText('Unit');
    fireEvent.change(input, { target: { value: "d" }});
    fireEvent.change(input, { target: { value: "a" }});
    fireEvent.change(input, { target: { value: "y" }});
    expect(mock.mock.calls.length).toBe(3)
})