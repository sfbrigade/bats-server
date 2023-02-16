import React from 'react';
import PropTypes from 'prop-types';
import FormInput from '../Components/FormInput';
import { useForm } from '../Components/Form';

import './BloodPressureField.scss';

function BPInput({ metadata, unit }) {
  const { data, onChange } = useForm();
  const { name, range = {} } = metadata;
  const { min, max } = range;

  return (
    <div className="bpfield__input">
      <FormInput
        property={name}
        value={data[name]}
        validationState={data.getValidationState(name)}
        unit={unit || metadata.unit}
        min={min}
        max={max}
        type="number"
        onChange={onChange}
      />
    </div>
  );
}

export default function BloodPressureField({ systolicMetadata, diastolicMetadata }) {
	return (
    <>
      <label htmlFor={systolicMetadata.name} className="usa-label">Blood pressure</label>
      <div className="bpfield">
        <BPInput
          metadata={systolicMetadata}
          unit="/"
        />
        <BPInput
          metadata={diastolicMetadata}
          unit="mmHG"
        />
      </div>
    </>
  );
}

BloodPressureField.propTypes = {
  systolicMetadata: PropTypes.object.isRequired,
  diastolicMetadata: PropTypes.object.isRequired
};
