import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import FormTextArea from './FormTextArea';

test('Snapshot', () => {
  const component = renderer.create(
    <FormTextArea
      label="Other"
      onChange={() => {}}
      property="otherObservationNotes"
      value='val'
    />);

    const componentJson = component.toJSON();
    expect(componentJson).toMatchSnapshot();
});

test('FormTextArea should trigger the onChange callback', () => {
  const mock = jest.fn();

  const wrapper = render(
    <FormTextArea
      label="Other"
      onChange={mock}
      property="otherObservationNotes"
      value='val'
    />);

    const input = wrapper.getByLabelText('Other');
    fireEvent.change(input, { target: { value: "t" }});
    fireEvent.change(input, { target: { value: "e" }});
    fireEvent.change(input, { target: { value: "s" }});
    fireEvent.change(input, { target: { value: "t" }});
    expect(mock.mock.calls.length).toBe(4);
})