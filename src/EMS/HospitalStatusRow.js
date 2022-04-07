import React from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import HospitalStatus from '../Models/HospitalStatus';

import './HospitalStatusRow.scss';

function HospitalStatusRow({ hospitalStatus }) {
  const disabled = window.env.REACT_APP_DISABLE_PILOT_HOSPITALS === 'true' && hospitalStatus.hospitalName !== 'SF General';
  return (
    <div className="grid-row">
      <div className="grid-col-4 hospitalstatusrow__name-container">
        <h3 className="hospitalstatusrow__name">{hospitalStatus.hospitalName}</h3>
        <div className="hospitalstatusrow__timestamp">
          {!disabled && DateTime.fromISO(hospitalStatus.updateDateTimeLocal).toFormat('LL/dd - HH:mm')}
        </div>
      </div>
      {disabled && (
        <div className="grid-col-8 hospitalstatusrow__info-container">
          <div className="hospitalstatusrow__data-container">
            <div className="hospitalstatusrow__data hide-diversion-column" />
            <div className="hospitalstatusrow__data">-</div>
            <div className="hospitalstatusrow__data">-</div>
            <div className="hospitalstatusrow__data">-</div>
            <div className="hospitalstatusrow__data">-</div>
          </div>
          <div className="hospitalstatusrow__notes" />
        </div>
      )}
      {!disabled && (
        <div className="grid-col-8 hospitalstatusrow__info-container">
          <div className="hospitalstatusrow__data-container">
            <div
              className={`hospitalstatusrow__data hide-diversion-column ${hospitalStatus.divertStatusIndicator ? 'text-secondary' : ''}`}
            >
              {hospitalStatus.divertStatusIndicator ? 'Yes' : 'No'}
            </div>
            <div className={`hospitalstatusrow__data ${hospitalStatus.openEdBedCount === 0 ? 'text-secondary text-bold' : ''}`}>
              {hospitalStatus.openEdBedCount}
            </div>
            <div className={`hospitalstatusrow__data ${hospitalStatus.openPsychBedCount === 0 ? 'text-secondary text-bold' : ''}`}>
              {hospitalStatus.openPsychBedCount}
            </div>
            <div className="hospitalstatusrow__data">{hospitalStatus.ambulancesEnRoute || 0}</div>
            <div className="hospitalstatusrow__data">{hospitalStatus.ambulancesOffloading || 0}</div>
          </div>
          <div className="hospitalstatusrow__notes">{hospitalStatus.additionalServiceAvailabilityNotes}</div>
        </div>
      )}
    </div>
  );
}

HospitalStatusRow.propTypes = {
  hospitalStatus: PropTypes.instanceOf(HospitalStatus).isRequired,
};

export default HospitalStatusRow;
