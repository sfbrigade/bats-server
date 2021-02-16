import React, { useState } from 'react';

const Counter = (props) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
    props.update();
  };

  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
    props.update();
  };

  return (
    <div className="Beds_Counter_Container">
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-7 Beds_Counter_Title">{props.CountTitle}</div>
          <div className="grid-col-auto">
            <button className="usa-button circle-2px padding-2" onClick={handleDecrement}>
              <span className="font-alt-lg">-</span>
            </button>
          </div>
          <div className="grid-col-auto Beds_Counter_Number_Box">
            <div className="margin-0 position-absolute bottom-05 left-2">{count}</div>
          </div>
          <div className="grid-col-auto">
            <button className="usa-button circle-2px padding-2" onClick={handleIncrement}>
              <span className="font-alt-lg">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
