import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function FormInput({ label, onChange, property, required, showRequiredHint, value }) {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <label
        htmlFor={property}
        className={classNames('usa-label', { 'usa-label--required': showRequiredHint && required, 'usa-label--focused': focused })}
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
        className="usa-textarea"
      />
    </>
  );
}
FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  required: PropTypes.bool,
  showRequiredHint: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
FormInput.defaultProps = {
  required: false,
  showRequiredHint: true,
  value: '',
};
export default FormInput;
