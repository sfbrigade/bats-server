import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import FormRadio from './FormRadio';
import FormRadioFieldSet from './FormRadioFieldSet';

test('Snapshot', () => {
  const component = renderer.create(
    <FormRadioFieldSet
      labelText="Select Favorite Fruit"
      property="fruit"
      isRequired
      validationState='FIXED'
    >
      <FormRadio
        onChange={() => {}}
        currentValue="APPLE"
        label="Apple"
        property="fruit"
        value="APPLE"
      />
      <FormRadio
        onChange={() => {}}
        currentValue="APPLE"
        label="Banana"
        property="fruit"
        value="BANANA"
      />
      <FormRadio
        onChange={() => {}}
        currentValue="APPLE"
        label="Coconut"
        property="fruit"
        value="COCONUT"
      />
    </FormRadioFieldSet>
  );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('FormInput should trigger the onChange callback', () => {
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  const mock3 = jest.fn();

  const value = 'APPLE';

  const wrapper = render(
    <FormRadioFieldSet
      labelText="Select Favorite Fruit"
      property="fruit"
      isRequired
      validationState='FIXED'
    >
      <FormRadio
        onChange={mock1}
        currentValue={value}
        label="Apple"
        property="fruit"
        value="APPLE"
      />
      <FormRadio
        onChange={mock2}
        currentValue={value}
        label="Banana"
        property="fruit"
        value="BANANA"
      />
      <FormRadio
        onChange={mock3}
        currentValue={value}
        label="Coconut"
        property="fruit"
        value="COCONUT"
      />
    </FormRadioFieldSet>
  );

    const radio = wrapper.getByLabelText('Banana');
    fireEvent.click(radio);
    expect(mock2.mock.calls.length).toBe(1);
    expect(mock1.mock.calls.length).toBe(0);
})