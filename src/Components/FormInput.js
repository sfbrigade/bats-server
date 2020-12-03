import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function FormInput({ children, disabled, label, onChange, isWrapped, property, required, showRequiredHint, size, type, unit, value }) {
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
        className={classNames('usa-input', {
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
          className={classNames('usa-label', { 'usa-label--required': showRequiredHint && required, 'usa-label--focused': focused })}
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
  type: PropTypes.oneOf(['number', 'text']),
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
};
export default FormInput;
