import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import TabBar from './TabBar';
import RingdownIcon from './Icons/Ringdown';
import HospitalIcon from './Icons/Hospital';

const tabs = [
  { label: 'Ringdown', Icon: RingdownIcon },
  { label: 'Hospital Info', Icon: HospitalIcon },
];

export default function RoutedHeader({ selectedTab, onSelect }) {
  return (
    <Header name="Routed">
      <TabBar tabs={tabs} selectedTab={selectedTab} onSelect={onSelect} />
    </Header>
  );
}

RoutedHeader.propTypes = {
  selectedTab: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};
