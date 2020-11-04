import React, { useState } from 'react';

import Header from '../Components/Header';
import TabBar from '../Components/TabBar';

import Beds from './Beds';
import RingDown from './RingDown';

export default function ER() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <Header name="Hospital Destination Tool">
        <TabBar onSelect={setSelectedTab} tabs={['Ringdowns', 'Hospital Info']} />
      </Header>
      {selectedTab === 0 && <RingDown />}
      {selectedTab === 1 && <Beds />}
    </>
  );
}
