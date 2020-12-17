import React from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import HospitalStatus from '../Models/HospitalStatus';

import './HospitalStatusRow.scss';

const HospitalStatusRow = ({ hospitalStatus }) => (
  <div className="grid-container">
    <div className="grid-row">
      <div className="grid-col-4 hospitalstatusrow__name-container">
        <h3 className="hospitalstatusrow__name">{hospitalStatus.hospitalName}</h3>
        <div className="hospitalstatusrow__timestamp">{DateTime.fromISO(hospitalStatus.updateDateTimeLocal).toFormat('LL/dd t')}</div>
      </div>
      <div className="grid-col-8 hospitalstatusrow__info-container">
        <div className="hospitalstatusrow__data-container">
          <div className={`hospitalstatusrow__data ${hospitalStatus.divertStatusIndicator ? 'text-secondary' : ''}`}>
            {hospitalStatus.divertStatusIndicator ? 'Yes' : 'No'}
          </div>
          <div className={`hospitalstatusrow__data ${hospitalStatus.openEdBedCount === 0 ? 'text-secondary' : ''}`}>
            {hospitalStatus.openEdBedCount}
          </div>
          <div className={`hospitalstatusrow__data ${hospitalStatus.openPsychBedCount === 0 ? 'text-secondary' : ''}`}>
            {hospitalStatus.openPsychBedCount}
          </div>
          <div className="hospitalstatusrow__data">todo</div>
          <div className="hospitalstatusrow__data">todo</div>
        </div>
        <div className="hospitalstatusrow__notes">{hospitalStatus.additionalServiceAvailabilityNotes}</div>
      </div>
    </div>
  </div>
);

// TODO - how to handle date updated and hospital status notes?

HospitalStatusRow.propTypes = {
  hospitalStatus: PropTypes.instanceOf(HospitalStatus).isRequired,
};

export default HospitalStatusRow;
