import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

function FormTextArea({ label, onChange, property, required, showRequiredHint, value, validationState }) {
  const [focused, setFocused] = useState(false);

  return (
    <>
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
      <textarea
        id={property}
        value={value || ''}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(property, e.target.value)}
        onFocus={() => setFocused(true)}
        required={required}
        className={classNames('usa-textarea', {
          'usa-input--error': validationState === ValidationState.ERROR,
          'usa-input--success': validationState === ValidationState.FIXED,
        })}
      />
      <ValidationMessage validationState={validationState} />
    </>
  );
}

FormTextArea.propTypes = {
  label: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  required: PropTypes.bool,
  showRequiredHint: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  validationState: PropTypes.oneOf([...ValidationState.ALL_STATES]),
};

FormTextArea.defaultProps = {
  required: false,
  showRequiredHint: true,
  value: '',
  validationState: ValidationState.NO_INPUT,
};

export default FormTextArea;
