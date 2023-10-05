import React from 'react';
import PropTypes from 'prop-types';

// Required Input Components. A default Value can be utilized or just a regular value

function RequiredInput(props) {
  const name = props.name;
  const value = props.value;
  const handleValidationEvent = props.handleValidationEvent;
  const onChange = props.onChange;
  const defaultValue = props.defaultValue;
  const label = props.label;
  const type = props.type;

  return (
    <div className="usa-form-group margin-y-4 text-left">
      <label htmlFor={name} className="usa-label">
        {label}
      </label>
      {defaultValue !== undefined ? (
        <input
          type={type}
          defaultValue={defaultValue}
          id={name}
          data-testid={name}
          name={name}
          className="usa-input"
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => handleValidationEvent(e)}
          onFocus={(e) => handleValidationEvent(e)}
          onInput={(e) => handleValidationEvent(e)}
        />
      ) : (
        <input
          type={type}
          value={value}
          id={name}
          data-testid={name}
          name={name}
          className="usa-input"
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => handleValidationEvent(e)}
          onFocus={(e) => handleValidationEvent(e)}
          onInput={(e) => handleValidationEvent(e)}
        />
      )}
    </div>
  );
}

RequiredInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  handleValidationEvent: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};
export default RequiredInput;
