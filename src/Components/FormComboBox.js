import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// TODO: fix these paths.  probably need to go to node_modules/@uswds/uswds/packages/usa-combo-box/src
//  and may need to switch to using .enable() instead of .on()
//import { comboBox } from '../../node_modules/@uswds/uswds/dist/js/uswds';
//import { comboBox } from '../../node_modules/uswds/src/js/components';

import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

function FormComboBox({ label, property, required, onChange, options, showRequiredHint, size, validationState, value }) {
  const ref = useRef();
  const [focused, setFocused] = useState(false);
  const [customOption, setCustomOption] = useState(null);

  useEffect(() => {
    const { current } = ref;
//    comboBox.on(current);
    // manually add event handlers to the custom input added by USWDS
    const select = current.querySelector('select');
    const input = current.querySelector('input[type="text"]');
    input.addEventListener('input', (e) => setCustomOption(e.target.value));
    input.addEventListener('focus', () => setFocused(true));
    input.addEventListener('blur', (e) => {
      setFocused(false);
      select.value = e.target.value;
      const event = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { value },
      });
      select.dispatchEvent(event);
    });
    input.value = value;
//    return () => {
//      comboBox.off(current);
//    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { current } = ref;
    // manually add/remove validation classes to the custom input added by USWDS
    const input = current.querySelector('input[type="text"]');
    if (validationState === ValidationState.ERROR) {
      input.classList.add('usa-input--error');
    } else {
      input.classList.remove('usa-input--error');
    }
    if (validationState === ValidationState.FIXED) {
      input.classList.add('usa-input--success');
    } else {
      input.classList.remove('usa-input--success');
    }
  }, [validationState]);

  // first check if value exists as customOption or in options, if not, set as the custom option
  if (value && value !== customOption) {
    if (options.every((o) => value.toString().localeCompare(o.props.value, undefined, { sensitivity: 'base' }) !== 0)) {
      setCustomOption(value);
    } else if (customOption) {
      setCustomOption(null);
    }
  }
  // combine the custom entered value in the input box with the options as needed
  let combinedOptions = options;
  if (
    customOption &&
    options.every((o) => customOption.toString().localeCompare(o.props.value, undefined, { sensitivity: 'base' }) !== 0)
  ) {
    combinedOptions = [
      <option key={customOption} value={customOption}>
        {customOption}
      </option>,
    ].concat(options);
  }

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
            'usa-input--medium': size === 'medium',
            'usa-input--small': size === 'small',
          })}
          name={property}
          id={property}
          required={required}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            onChange(property, e.target.value);
          }}
          onFocus={() => setFocused(true)}
          value={value}
        >
          {combinedOptions}
        </select>
      </div>
      <ValidationMessage validationState={validationState} />
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
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

FormComboBox.defaultProps = {
  showRequiredHint: true,
  size: null,
  validationState: ValidationState.NO_INPUT,
  value: '',
};

export default FormComboBox;
