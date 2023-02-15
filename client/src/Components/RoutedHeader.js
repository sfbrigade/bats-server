import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import TabBar from './TabBar';
import RingdownIcon from './Icons/Ringdown';
import HospitalIcon from './Icons/Hospital';

const tabs = [
  { label: 'Ringdown', Icon: RingdownIcon, id: 'ringdownForm' },
  { label: 'Hospital Info', Icon: HospitalIcon, id: 'hospitalStatuses' },
];

export default function RoutedHeader({ selectedTab, onSelect }) {
  return (
    <Header name="Routed">
      <TabBar tabs={tabs} selectedTab={selectedTab} onSelect={onSelect} />
    </Header>
  );
}

RoutedHeader.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
