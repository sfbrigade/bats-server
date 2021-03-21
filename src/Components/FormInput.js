import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ApiService from '../ApiService';



function FormInput({ children, disabled, label, onChange, isWrapped, property, required, showRequiredHint, size, type, unit, value }) {
  const [focused, setFocused] = useState(false);

  function useDebounce(searchValue, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(searchValue);
    useEffect(
      () => {
        // Set debouncedValue to value (passed in) after the specified delay
        const handler = setTimeout(() => {
          setDebouncedValue(searchValue);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      }
    );
  
    return debouncedValue;
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [isNotValidId, setIsNotValidId] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  function SearchCharacters(search) {
    let dispatchCallNumber;
    if (search) {
      ApiService.ringdowns.checkValidRingdown(search).then((r2) => {
        dispatchCallNumber = r2.data;
      })
      .catch((error) => {
        /* eslint-disable no-console */
        console.log(error);
      })
    } 
    // using setTimeout before setting setIsValidId and calling dispatchcallNumber because we're using 
    // Debouncing so the dispatchCallNumber returns undefined originally. 
      
    setTimeout(() => { 
      if (dispatchCallNumber) {
        setIsNotValidId(true);
      }
      else { 
        setIsNotValidId(false);
      }
    }, 200)
  }
  
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSearchTerm && debouncedSearchTerm.id === "dispatchCallNumber") {
        SearchCharacters(debouncedSearchTerm.value)
      } 
    }
  );

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
        onChange={(e) => onChange(property, typedValue(e.target.value), setSearchTerm(e.target))}
        onFocus={() => setFocused(true)}
        required={required}
        type={type}
        className={classNames('usa-input', {
          'usa-input--medium': size === 'medium',
          'usa-input--small': size === 'small',
        })}
      />
      {isNotValidId ? <span style={{color:'red', display:'flex'}}>&nbsp;&nbsp;Incident # already exists, please use a different one.</span> : null}
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
