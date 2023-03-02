import React, { useState } from 'react';
import { useForm } from '../Components/Form';
import FormInput from '../Components/FormInput';

import { ValidationState } from '../Models/PatientFieldData';
import classNames from 'classnames';

import './TemperatureField.scss';

const TemperatureInput = ({ metadata, unit, onChange, value }) => {
  const { data } = useForm();
  const { name, range = {} } = metadata || {};
  const { min, max } = range;

  return (
    <div className="temperature-field__input">
      <FormInput
        type="number"
        property={name}
        value={data[name] || value}
        validationState={data.getValidationState(name)}
        unit={unit || metadata?.unit}
        min={min}
        max={max}
        onChange={onChange}
      />
    </div>
  );
};

const TemperatureField = ({ temperatureMetadata }) => {
  const { data, onChange } = useForm();
  const [celsius, setCelsius] = useState('');
  const celsiusMetadata = { name: 'celsius', unit: '°C', range: { min: 26.5, max: 65.5 } };

  const hasError = data.getValidationState(temperatureMetadata.name) === ValidationState.RANGE_ERROR;

  const handleOnChange = (name, value) => {
    if (name === 'celsius') {
      onChange('temperature', (parseFloat(value) * 1.8 + 32).toFixed(2));
      setCelsius(value);
    } else {
      onChange(name, value);
      setCelsius(((parseFloat(value) - 32) / 1.8).toFixed(2));
    }
  };
  return (
    <>
      <label htmlFor={temperatureMetadata.name} className={classNames('usa-label', { 'usa-label--error': hasError })}>
        Temperature
      </label>
      <div className="temperature-field">
        <TemperatureInput metadata={temperatureMetadata} onChange={handleOnChange} />
        <TemperatureInput metadata={celsiusMetadata} value={celsius} onChange={handleOnChange} />
      </div>
    </>
  );
};

export default TemperatureField;
