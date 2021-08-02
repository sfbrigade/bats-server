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