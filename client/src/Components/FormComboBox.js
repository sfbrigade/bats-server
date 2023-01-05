import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {comboBox} from '../../../node_modules/uswds/src/js/components';

import { ValidationState } from '../Models/PatientFieldData';
import ValidationMessage from './ValidationMessage';

/**
 * Normally, the USWDS ComboBox ONLY allows selection of a value from the options list. The
 * text input is used only as a typeahead search filter.
 *
 * This component attempts to extend the behavior of the ComboBox such that it also allows
 * a free-form value typed in the text input box to be an acceptable value. For example,
 * if our CAD integration is behind and an incident number is not yet available in the dropdown,
 * it can still be typed in manually into the box.
 *
 */
function FormComboBox({ label, property, required, onChange, options, showRequiredHint, size, validationState, value }) {
  const ref = useRef();
  const [focused, setFocused] = useState(false);
  // the inputValue state mirrors the contents of the input box created by USWDS ComboBox
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const { current } = ref;
    comboBox.on(current);
    // get a reference to the select component so we can dispatch events through it
    const select = current.querySelector('select');
    function dispatchSelectChangeEvent(value) {
      select.value = value;
      const event = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { value },
      });
      select.dispatchEvent(event);
    }
    // manually add event handlers to the custom input added by USWDS
    const input = current.querySelector('input[type="text"]');
    input.addEventListener('input', (e) => {
      // just capture the typed in input value so that it can be added to the
      // select options if it doesn't already match one of them
      setInputValue(e.target.value);
    });
    input.addEventListener('change', (e) => {
      if (e instanceof CustomEvent) {
        // a custom change event on the input is done sometimes by USWDS ComboBox
        // that causes the input value and select value to get out of sync-
        // this puts it back into sync
        setInputValue(e.target.value);
        dispatchSelectChangeEvent(e.target.value);
      }
    });
    input.addEventListener('focus', () => setFocused(true));
    input.addEventListener('blur', (e) => {
      // when we blur/exit the input, we dispatch the value through the
      // select as the selected value
      setFocused(false);
      dispatchSelectChangeEvent(e.target.value);
    });
    return () => {
      comboBox.off(current);
    };
  }, []);

  useEffect(() => {
    const { current } = ref;
    const input = current.querySelector('input[type="text"]');
    input.value = value;
  }, [value]);

  useEffect(() => {
    const { current } = ref;
    // manually add/remove validation classes to the custom input added by USWDS
    const input = current.querySelector('input[type="text"]');
    if (validationState === ValidationState.ERROR) {
      input.classList.add('usa-input--error');
    } else {
      input.classList.remove('usa-input--error');
    }
  }, [validationState]);

  // combine the custom entered value in the input box with the options as needed
  let combinedOptions = options;
  if (inputValue && options.every((o) => inputValue.toString().localeCompare(o.props.value, undefined, { sensitivity: 'base' }) !== 0)) {
    combinedOptions = [
      <option key={inputValue} value={inputValue}>
        {inputValue}
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
