import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import TabBar from './TabBar';
import RingdownIcon from './Icons/Ringdown';
import HospitalIcon from './Icons/Hospital';

import './RoutedHeader.scss';

const tabs = [
  { label: 'Ringdown', Icon: RingdownIcon, id: 'ringdown' },
  { label: 'Hospital Info', Icon: HospitalIcon, id: 'hospitalInfo' },
];

function RoutedHeader({ selectedTab, onSelect, venue, hospital }) {
  return (
    <Header className="routed-header" name="Routed">
      {venue && (
        <h4 className="routed-header__venue">
          {venue.name}
          {hospital && ` (${hospital.name})`}
        </h4>
      )}
      <TabBar tabs={tabs} selectedTab={selectedTab} onSelect={onSelect} />
    </Header>
  );
}

RoutedHeader.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  venue: PropTypes.object,
  hospital: PropTypes.object,
};

export default RoutedHeader;
