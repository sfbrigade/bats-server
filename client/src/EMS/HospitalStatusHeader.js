import React from 'react';

import './HospitalStatusHeader.scss';

const HospitalStatusHeader = ({ isVenue = false }) => (
  <div className="grid-container">
    <div className="grid-row hospitalstatusheader__container">
      <div className="grid-col-4" />
      <div className="grid-col-8 display-flex flex-align-end">
        <div className="hospitalstatusheader__column-container hide-diversion-column">
          <h3 className="hospitalstatusheader__column-name">Diversion</h3>
        </div>
        <div className="hospitalstatusheader__column-container">
          {!isVenue && <h3 className="hospitalstatusheader__column-name">ER Beds</h3>}
        </div>
        <div className="hospitalstatusheader__column-container">
          {!isVenue && <h3 className="hospitalstatusheader__column-name">Behav. Beds</h3>}
        </div>
        <div className="hospitalstatusheader__column-container">
          <h3 className="hospitalstatusheader__column-name">En route</h3>
        </div>
        <div className="hospitalstatusheader__column-container">
          <h3 className="hospitalstatusheader__column-name">Waiting</h3>
        </div>
      </div>
    </div>
  </div>
);

export default HospitalStatusHeader;
