import React, { useState } from 'react';

const DiversionPopupConfirmation = (props) => {
  return (
    <div className="Beds_Popup">
      <div class="usa-alert usa-alert--success" >
  <div class="usa-alert__body">
    <h3 class="usa-alert__heading">Divert status updated</h3>
    <p class="usa-alert__text">Ambulances will be notified.</p>
  </div>
  <button className="usa-button" onClick={props.ok}>
          Back to form
        </button>
</div>
    </div>
  );
};

export default DiversionPopupConfirmation;
