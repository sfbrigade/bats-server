import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

function FormRadio({ label, name, value, checked, disabled, onChange }) {
  const handleChange = useCallback(() => onChange(name, value), [name, value, onChange]);
  const id = `${name}-${value}`;

  return (
    <div className="usa-radio">
      <input
        className="usa-radio__input"
        disabled={disabled}
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      <label className="usa-radio__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

FormRadio.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
};

FormRadio.defaultProps = {
  name: '',
  onChange: null,
  checked: false,
  disabled: false,
};

export default FormRadio;
