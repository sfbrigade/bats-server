import React, { useState } from 'react';

const DiversionPopup = (props) => {
  return (
    <div className="popup">
      <div className="PopupInner PopupOne">
        <h1>Change divert status?</h1>
        <p>Ambulances will be notified.</p>
        <button className="usa-button--outline" onClick={props.keep}>
          Keep status
        </button>{' '}
        <button className="usa-button--secondary" onClick={props.update}>
          Update status
        </button>
      </div>
    </div>
  );
};

export default DiversionPopup;
