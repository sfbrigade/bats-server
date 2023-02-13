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

  const handleOnChange = (e) => {
    const { value } = e.target;
    onChange(property, value);
  };

  const handleOnBlur = () => {
    setFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === '-' && type === 'number' && min >= 0) {
      e.preventDefault();
    }
  };

  const hasError =
    (validationState === ValidationState.REQUIRED_ERROR || validationState === ValidationState.RANGE_ERROR) &&
    ((focused && value?.length > 1) || !focused);

  let input = (
    <>
      <div className="usa-input__wrapper">
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
            'usa-input--error': hasError || error?.errorsFor(property),
            'usa-input--medium': size === 'medium',
            'usa-input--small': size === 'small',
          })}
        />
        {error?.errorsFor(property) && (
          <div className="usa-error-message usa-error-message--static">
            <i className="fas fa-exclamation-circle" />{' '}
            {error
              .errorsFor(property)
              .map((e) => e.message)
              .join(' ')}
          </div>
        )}
        {!focused && <ValidationMessage validationState={validationState} min={min} max={max} />}
      </div>
      {unit && <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;{unit}</span>}
      {children}
    </>
  );

  if (isWrapped) {
    input = (
      <section className="usa-input__group">
        <div className="grid-row flex-align-start">{input}</div>
      </section>
    );
  }

  return (
    <>
      {label && (
        <label
          htmlFor={property}
          className={classNames('usa-label', {
            'usa-label--required': showRequiredHint && required,
            'usa-label--focused': focused,
            'usa-label--error': hasError || error?.errorsFor(property),
          })}
        >
          {label}
        </label>
      )}
      {input}
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
  validationState: ValidationState.EMPTY_INPUT,
  error: undefined,
};

export default FormInput;
