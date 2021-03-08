import React, { useState } from 'react';
import './Counter.scss';
import PropTypes from 'prop-types';

const Counter = ({ update, CountTitle }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
    update();
  };

  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
    update();
  };

  return (
    <div className="counter_container">
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-7 margin-0 counter_title">{CountTitle}</div>
          <div className="grid-col-auto">
            <button type="button" className="usa-button counter_button circle-2px margin-1 padding-2" onClick={handleDecrement}>
              <span className="font-alt-lg counter_button_text">-</span>
            </button>
          </div>
          <div className="grid-col-auto counter_number_box">
            <div className="margin-0 position-absolute bottom-05 left-2">{count}</div>
          </div>
          <div className="grid-col-auto">
            <button type="button" className="usa-button counter_button circle-2px margin-1 padding-2" onClick={handleIncrement}>
              <span className="font-alt-lg counter_button_text">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Counter.propTypes = {
  update: PropTypes.func.isRequired,
  CountTitle: PropTypes.string.isRequired,
};

export default Counter;
