import React from 'react';
import PropTypes from 'prop-types';

function FormRadio({ currentValue, disabled, label, onChange, property, value }) {
  const id = `${property}-${value}`;
  return (
    <div className="usa-radio">
      <input
        onChange={() => onChange(property, value)}
        className="usa-radio__input"
        disabled={disabled}
        id={id}
        type="radio"
        name={property}
        value={value}
        checked={currentValue === value}
      />
      <label className="usa-radio__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
FormRadio.propTypes = {
  currentValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
};
FormRadio.defaultProps = {
  currentValue: null,
  disabled: false,
  value: null,
};
export default FormRadio;
