import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function FormCheckbox({ className, currentValue, disabled, id, label, onChange, property, value }) {
  function toggle(val) {
    // if boolean, then negate
    if (typeof value === 'boolean') {
      return !val;
    }
    // otherwise, set/clear value
    if (val === value) {
      return null;
    }
    return value;
  }

  return (
    <div className="usa-checkbox">
      <input
        checked={currentValue === value}
        className="usa-checkbox__input"
        disabled={disabled}
        id={id ?? `${property}-${value}`}
        name={property}
        onChange={() => onChange(property, toggle(currentValue))}
        type="checkbox"
        value={value}
      />
      <label className={classNames('usa-checkbox__label', className)} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

FormCheckbox.propTypes = {
  currentValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
};

FormCheckbox.defaultProps = {
  currentValue: null,
  disabled: false,
  value: true,
};

export default FormCheckbox;
