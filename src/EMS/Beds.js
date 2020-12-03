import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import BedInfo from './BedInfo';

const Beds = ({ className }) => (
  <div className={classNames('bedContent', className)}>
    <h1 className="title">Hospital beds + rigs</h1>
    <h3>SF General</h3>
    {/* BedInfo Component will take props containing bed info to be displayed */}
    <BedInfo />
    <h3>CPMC Mission Bernal</h3>
    <BedInfo />
    <h3>CPMC Davies</h3>
    <BedInfo />
    <h3>CPMC Van Ness</h3>
    <BedInfo />
    <h3>St Francis</h3>
    <BedInfo />
    <h3>Chinese Hospital</h3>
    <BedInfo />
    <h3>Kaiser</h3>
    <BedInfo />
    <h3>St Mary&apos;s</h3>
    <BedInfo />
    <h3>UCSF Parnassus</h3>
    <BedInfo />
    <h3>VA Medical Center</h3>
    <BedInfo />
  </div>
);

Beds.propTypes = {
  className: PropTypes.string,
};

Beds.defaultProps = {
  className: null,
};

export default Beds;
