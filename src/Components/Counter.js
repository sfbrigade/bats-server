import React from 'react';
import PropTypes from 'prop-types';

import './Counter.scss';

function Counter({ label, min, max, name, onChange, value }) {
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

  return (
    <div className="counter">
      <label className="counter__label" htmlFor={name}>
        {label}
      </label>
      <div className="counter__control">
        <button type="button" className="usa-button counter__button counter__button--decrement" onClick={handleDecrement}>
          &minus;
        </button>
        <input className="usa-input usa-input--small counter__input" type="text" readonly id={name} name={name} value={value} />
        <button type="button" className="usa-button counter__button counter__button--increment" onClick={handleIncrement}>
          +
        </button>
      </div>
    </div>
  );
}

Counter.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number.isRequired,
};

Counter.defaultProps = {
  min: undefined,
  max: undefined,
};

export default Counter;
