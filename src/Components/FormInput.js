import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';


const INPUT_RANGES = {
  systolicBloodPressure: {min: 120, max: 180},
  diastolicBloodPressure: {min: 80 , max: 120},
  heartRateBpm: {min: 40, max: 200},
  respiratoryRate: {min:12, max:25},
  oxygenSaturation: {max: 100},
  temperature: {min: 80, max: 150}
};


function FormInput({
  children,
  disabled,
  label,
  onChange,
  isWrapped,
  property,
  required,
  showRequiredHint,
  size,
  type,
  unit,
  value,
  validationState,
}) {
  const [focused, setFocused] = useState(false);

  function typedValue(stringValue) {
    if (type === 'number') {
      const number = Number(stringValue);
      if (stringValue === '' || number === Number.NaN) {
        return null;
      }
      return number;
    }
    return stringValue;
  }

  let input = (
    <>
      <input
        id={property}
        disabled={disabled}
        value={value || ''}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(property, typedValue(e.target.value))}
        onFocus={() => setFocused(true)}
        required={required}
        type={type}
        min={INPUT_RANGES[property] ? INPUT_RANGES[property]['min'] : null }
        max={INPUT_RANGES[property] ? INPUT_RANGES[property]['max'] : null }
        placeholder={INPUT_RANGES[property] ? INPUT_RANGES[property]['min'] : null }
        className={classNames('usa-input', {
          'usa-input--error': validationState === ValidationState.ERROR,
          'usa-input--success': validationState === ValidationState.FIXED,
          'usa-input--medium': size === 'medium',
          'usa-input--small': size === 'small',
        })}
      />
      {unit && <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;{unit}</span>}
      {children}
    </>
  );

  if (isWrapped) {
    input = <div className="grid-row flex-align-center">{input}</div>;
  }

  return (
    <>
      {label && (
        <label
          htmlFor={property}
          className={classNames('usa-label', {
            'usa-label--required': showRequiredHint && required,
            'usa-label--focused': focused,
            'usa-label--error': validationState === ValidationState.ERROR,
            'usa-label--success': validationState === ValidationState.FIXED,
          })}
        >
          {label}
        </label>
      )}
      {input}
      <ValidationMessage validationState={validationState} />
    </>
  );
}

FormInput.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  disabled: PropTypes.bool,
  isWrapped: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  required: PropTypes.bool,
  showRequiredHint: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  type: PropTypes.oneOf(['number', 'text']),
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  validationState: PropTypes.oneOf([...ValidationState.ALL_STATES]),
};

FormInput.defaultProps = {
  children: null,
  disabled: false,
  isWrapped: true,
  label: null,
  required: false,
  showRequiredHint: true,
  size: null,
  type: 'text',
  unit: null,
  value: '',
  validationState: ValidationState.NO_INPUT,
};

export default FormInput;
