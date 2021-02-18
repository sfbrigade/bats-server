import React, { useState } from 'react';
import './DiversionPopup.scss';

const DiversionPopup = (props) => {
  return (
    <div className="DiversionPopup">
      <div class="usa-alert usa-alert--warning" >
  <div class="usa-alert__body">
    <h3 class="usa-alert__heading">Change divert status?</h3>
    <p class="usa-alert__text">Ambulances will be notified.</p>
  </div>
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
