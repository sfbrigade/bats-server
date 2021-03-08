import React from 'react';
import './DiversionPopup.scss';
import PropTypes from 'prop-types';

const DiversionPopup = ({ keep, update }) => {
  return (
    <div className="DiversionPopup">
      <div className="usa-alert usa-alert--warning">
        <div className="usa-alert__body">
          <h3 className="usa-alert__heading">Change divert status?</h3>
          <p className="usa-alert__text">Ambulances will be notified.</p>
        </div>
        <button type="button" className="usa-button--outline" onClick={keep}>
          Keep status
        </button>{' '}
        <button type="button" className="usa-button--secondary" onClick={update}>
          Update status
        </button>
      </div>
    </div>
  );
};

DiversionPopup.propTypes = {
  keep: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default DiversionPopup;
