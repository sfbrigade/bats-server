import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ValidationState } from '../Models/PatientFieldData';
import FormInput from '../Components/FormInput';
import { useForm } from '../Components/Form';

import './BloodPressureField.scss';
import FormMultiField from './FormMultiField';

function BPInput({ metadata, unit }) {
  const { data, onChange } = useForm();
  const { name, range = {} } = metadata;
  const { min, max } = range;

  return (
    // we need to add a wrapper around the FormInput component because it outputs
    // multiple children in a fragment.  we need each input's error message to be
    // grouped with its input in a div because the fields are arranged horizontally
    // in a row.  since the errors are absolutely positioned, they'd both shift to
    // the left margin of the .bpfield without this extra div, causing an overlap.
    <>
      <FormInput
        type="number"
        property={name}
        value={data[name]}
        validationState={data.getValidationState(name)}
        unit={unit || metadata.unit}
        min={min}
        max={max}
        onChange={onChange}
      />
    </>
  );
}

export default function BloodPressureField({ systolicMetadata, diastolicMetadata }) {
  const { data } = useForm();
  const validations = [data.getValidationState(systolicMetadata.name), data.getValidationState(diastolicMetadata.name)];
  const hasError = validations.includes(ValidationState.RANGE_ERROR);

  return (
    <FormMultiField
      label={
        <label htmlFor={systolicMetadata.name} className={classNames('usa-label', { 'usa-label--error': hasError })}>
          Blood pressure
        </label>
      }
    >
      <BPInput metadata={systolicMetadata} unit="/" />
      <BPInput metadata={diastolicMetadata} unit="mmHG" />
    </FormMultiField>
  );
}

BloodPressureField.propTypes = {
  systolicMetadata: PropTypes.object.isRequired,
  diastolicMetadata: PropTypes.object.isRequired,
};
