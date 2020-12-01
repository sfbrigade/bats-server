import React from 'react';
import PropTypes from 'prop-types';
import HospitalStatus from '../Models/HospitalStatus'

import './HospitalStatusRow.scss';

const HospitalStatusRow = ({ hospitalStatus }) => (
  <div className="grid-container">
    <div className="grid-row">
      <div className="grid-col-4 hospitalstatusrow__name-container">
        <h3 className="hospitalstatusrow__name">{hospitalStatus.hospitalName}</h3>
      </div>
      <div className="grid-col-8 hospitalstatusrow__data-container">
        <div className="">{hospitalStatus.diversionStatusIndicator ? "Yes" : "No"}</div>
        <div className="">{hospitalStatus.openEdBedCount}</div>
        <div className="">{hospitalStatus.openPsychBedCount}</div>
        <div className="">999</div>
        <div className="">999</div>
      </div>
    </div>
  </div>
);

// TODO - how to handle date updated and hospital status notes?

HospitalStatusRow.propTypes = {
  hospitalStatus: PropTypes.instanceOf(HospitalStatus).isRequired,
};

export default HospitalStatusRow;