import React from 'react';

import './HospitalStatusHeader.scss';

const HospitalStatusHeader = () => (
  <div className="grid-container">
    <div className="grid-row">
      <div className="grid-col-4" />
      <div className="grid-col-8">
        <div className="">Diversion</div>
        <div className="">ER Beds</div>
        <div className="">Psych Beds</div>
        <div className="">Amb. en route</div>
        <div className="">Amb. offloading</div>
      </div>
    </div>
  </div>
);

export default HospitalStatusHeader;
