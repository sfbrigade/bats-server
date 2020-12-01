import React from 'react';

import './HospitalStatusHeader.scss';

const HospitalStatusHeader = () => (
  <div className="grid-container">
    <div className="grid-row">
      <div className="grid-col-4" />
      <div className="grid-col-8">
        <div><h3 className="header__column-name">Diversion</h3></div>
        <div><h3 className="header__column-name">ER Beds</h3></div>
        <div><h3 className="header__column-name">Psych Beds</h3></div>
        <div><h3 className="header__column-name">Amb. en route</h3></div>
        <div><h3 className="header__column-name">Amb. offloading</h3></div>
      </div>
    </div>
  </div>
);

export default HospitalStatusHeader;