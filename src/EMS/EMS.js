import classNames from 'classnames';
import React, { useState } from 'react';

import Header from '../Components/Header';
import TabBar from '../Components/TabBar';

import HospitalStatuses from './HospitalStatuses';
import RingdownForm from './RingdownForm';

export default function EMS() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <Header name="Hospital Destination Tool">
        <TabBar onSelect={setSelectedTab} tabs={['Ringdown', 'Hospital Info']} />
      </Header>
      <RingdownForm className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 0 })} />
      <HospitalStatuses
        onReturn={console.log}
        className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 1 })}
      />
    </>
  );
}
