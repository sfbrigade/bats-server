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
<<<<<<< HEAD
      {selectedTab === 0 && <RingdownForm />}
      {selectedTab === 1 && <HospitalStatuses />}
=======
      <RingdownForm className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 0 })} />
      <Beds className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 1 })} />
>>>>>>> master
    </>
  );
}
