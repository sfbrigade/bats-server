import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { comboBox } from '../../node_modules/uswds/src/js/components';

import { ValidationState } from '../Models/PatientFieldData';

function FormComboBox({ label, property, required, onChange, options, showRequiredHint, size, validationState }) {
  const ref = useRef();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const { current } = ref;
    comboBox.on(current);
    return () => {
      comboBox.off(current);
    };
  }, []);

  return (
    <div ref={ref}>
      <label
        className={classNames('usa-label', {
          'usa-label--required': showRequiredHint && required,
          'usa-label--focused': focused,
          'usa-label--error': validationState === ValidationState.ERROR,
          'usa-label--success': validationState === ValidationState.FIXED,
        })}
        htmlFor={property}
      >
        {label}
      </label>
      <div className="usa-combo-box">
        <select
          className={classNames('usa-select', {
            'usa-input--error': validationState === ValidationState.ERROR,
            'usa-input--success': validationState === ValidationState.FIXED,
            'usa-input--medium': size === 'medium',
            'usa-input--small': size === 'small',
          })}
          name={property}
          id={property}
          required={required}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(property, e.target.value)}
          onFocus={() => setFocused(true)}
        >
          {options}
        </select>
      </div>
    </div>
  );
}

FormComboBox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  showRequiredHint: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  validationState: PropTypes.oneOf([...ValidationState.ALL_STATES]),
};

FormComboBox.defaultProps = {
  showRequiredHint: true,
  size: null,
  validationState: ValidationState.NO_INPUT,
};

export default FormComboBox;
