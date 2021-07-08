import React from 'react';
import PropTypes from 'prop-types';

export default function ComboBox({ label, property, required, onChange, options }) {
  return (
    <>
      <label className="usa-label" htmlFor={property}>
        {label}
      </label>
      <div className="usa-combo-box">
        <select
          className="usa-select usa-input--medium"
          name={property}
          id={property}
          required={required}
          onBlur={(e) => onChange(property, e.target.value)}
        >
          {options}
        </select>
      </div>
    </>
  );
}

ComboBox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  options: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
