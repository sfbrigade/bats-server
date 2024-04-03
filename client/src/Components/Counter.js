import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Counter.scss';

function Counter({ className, label, min, max, name, onChange, value, isEditing }) {
  function handleIncrement(event) {
    if (typeof max !== 'undefined' && parseInt(value, 10) >= max) {
      return;
    }
    event.target.name = name;
    event.target.value = parseInt(value, 10) + 1;
    onChange(event);
  }

  function handleDecrement(event) {
    if (typeof min !== 'undefined' && parseInt(value, 10) <= min) {
      return;
    }
    event.target.name = name;
    event.target.value = parseInt(value, 10) - 1;
    onChange(event);
  }

  function onChangeInternal(event) {
    const newValue = parseInt(event.target.value, 10);
    // reset if not a valid number
    if (Number.isNaN(newValue)) {
      event.target.value = value;
      onChange(event);
      return;
    }
    // if less than min, may not be done typing, just return
    if (typeof min !== 'undefined' && newValue < min) {
      return;
    }
    // if greater than max, reset
    if (typeof max !== 'undefined' && newValue > min) {
      event.target.value = value;
      onChange(event);
      return;
    }
    // otherwise, dispatch
    event.target.value = newValue;
    onChange(event);
  }

  return (
    <div className={classNames('counter', { 'counter--editing': isEditing }, className)}>
      <label className="counter__label" htmlFor={name}>
        {label}
      </label>
      <div className="counter__control">
        <button type="button" className="usa-button counter__button counter__button--decrement" onClick={handleDecrement} tabIndex={-1}>
          &minus;
        </button>
        <input
          className="usa-input usa-input--small counter__input"
          type="number"
          id={name}
          name={name}
          onBlur={onChangeInternal}
          onChange={onChangeInternal}
          value={Number.isNaN(value) ? '' : value}
        />
        <button type="button" className="usa-button counter__button counter__button--increment" onClick={handleIncrement} tabIndex={-1}>
          +
        </button>
      </div>
    </div>
  );
}

Counter.propTypes = {
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
};

Counter.defaultProps = {
  min: undefined,
  max: undefined,
  value: undefined,
};

export default Counter;
