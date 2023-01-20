import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';
import FormError from '../Models/FormError';

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
  min,
  max,
  unit,
  value,
  validationState,
  error,
}) {
  const [focused, setFocused] = useState(false);
  const [rangeError, setRangeError] = useState({ hasError: false, string: '' });
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

  const handleRange = (value, max = null, min = null) => {
    if (isNaN(min)) {
      return value && value > max ? false : true;
    } else if (!isNaN(min) && !isNaN(max)) {
      return value && (value < min || value > max) ? false : true;
    } else {
      return true;
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (type === 'number' && value === '-') {
      return null;
    } else {
      const isInRange = handleRange(value, max);
      onChange(property, typedValue(value));
      setRangeError({ string: '', hasError: !isInRange });
    }
  };

  const handleOnBlur = () => {
    setFocused(false);
    const isInRange = handleRange(value, max, min);
    const string = isInRange ? '' : `Valid Range: ${min} - ${max}`;
    setRangeError({ hasError: !isInRange, string });
  };

  const handleKeyDown = (e) => {
    if (e.key === '-' && type === 'number') {
      e.preventDefault();
    }
  };

  let input = (
    <>
      <input
        id={property}
        disabled={disabled}
        value={value || ''}
        onKeyDown={handleKeyDown}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        onFocus={() => setFocused(true)}
        required={required}
        type={type}
        min={min}
        max={max}
        className={classNames('usa-input', {
          'usa-input--error': validationState === ValidationState.ERROR || error?.errorsFor(property) || rangeError.hasError,
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
            'usa-label--error': validationState === ValidationState.ERROR || error?.errorsFor(property),
          })}
        >
          {label}
        </label>
      )}
      {input}
      {error?.errorsFor(property) && (
        <div className="usa-error-message usa-error-message--static">
          <i className="fas fa-exclamation-circle" />{' '}
          {error
            .errorsFor(property)
            .map((e) => e.message)
            .join(' ')}
        </div>
      )}
      {handleRange()}
      <ValidationMessage validationState={validationState} errorString={rangeError.string} />
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
  type: PropTypes.oneOf(['number', 'text', 'password']),
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  validationState: PropTypes.oneOf([...ValidationState.ALL_STATES]),
  error: PropTypes.instanceOf(FormError),
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
  min: null,
  max: null,
  unit: null,
  value: '',
  validationState: ValidationState.NO_INPUT,
  error: undefined,
};

export default FormInput;
