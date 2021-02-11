import React from 'react';

const ButtonRight = (props) => {
  return (
    <div className="grid-row height-7 width-card-full">
      <div className="grid-col-9"></div>
      <div className="grid-col-3">
        <button className="usa-button" onClick={props.update}>
          {props.ButtonTitle}
        </button>
      </div>
    </div>
  );
};

export default ButtonRight;
