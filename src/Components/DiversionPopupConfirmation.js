import React from 'react';
import './DiversionPopup.scss';
import PropTypes from 'prop-types';

const DiversionPopupConfirmation = ({ ok }) => {
  return (
    <div className="DiversionPopup">
      <div className="usa-alert usa-alert--success">
        <div className="usa-alert__body">
          <h3 className="usa-alert__heading">Divert status updated</h3>
          <p className="usa-alert__text">Ambulances will be notified.</p>
        </div>
        <button type="button" className="usa-button" onClick={ok}>
          Back to form
        </button>
      </div>
    </div>
  );
};

DiversionPopupConfirmation.propTypes = {
  ok: PropTypes.func.isRequired,
};

export default DiversionPopupConfirmation;
