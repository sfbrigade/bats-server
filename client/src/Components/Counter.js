import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Counter.scss';

function Counter({ label, min, max, name, onChange, value, isEditing }) {
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
    <div className={classNames('counter', { 'counter--editing': isEditing })}>
      <label className="counter__label" htmlFor={name}>
        {label}
      </label>
      <div className="counter__control">
        <button type="button" className="usa-button counter__button counter__button--decrement" onClick={handleDecrement}>
          &minus;
        </button>
        {!Number.isNaN(value) && (
          <input
            className="usa-input usa-input--small counter__input"
            type="text"
            readOnly={!isEditing}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
        <button type="button" className="usa-button counter__button counter__button--increment" onClick={handleIncrement}>
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
