import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

function FormTextArea({ children, label, onChange, property, disabled, required, showRequiredHint, value, validationState }) {
  const [focused, setFocused] = useState(false);

  return (
    <>
      {label && (
        <label
          htmlFor={property}
          className={classNames('usa-label', {
            'usa-label--required': showRequiredHint && required,
            'usa-label--focused': focused,
            'usa-label--error': validationState === ValidationState.ERROR,
          })}
        >
          {label}
        </label>
      )}
      <textarea
        id={property}
        disabled={disabled}
        value={value || ''}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(property, e.target.value)}
        onFocus={() => setFocused(true)}
        required={required}
        className={classNames('usa-textarea', {
          'usa-input--disabled': disabled,
          'usa-input--error': validationState === ValidationState.ERROR,
        })}
      />
      {children}
      <ValidationMessage className="" validationState={validationState} />
    </>
  );
}

FormTextArea.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  showRequiredHint: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  validationState: PropTypes.oneOf([...ValidationState.ALL_STATES]),
};

FormTextArea.defaultProps = {
  children: undefined,
  label: undefined,
  disabled: false,
  required: false,
  showRequiredHint: true,
  value: '',
  validationState: ValidationState.NO_INPUT,
};

export default FormTextArea;
