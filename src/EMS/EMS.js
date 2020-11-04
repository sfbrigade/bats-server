import React, { useState } from 'react';

import Header from '../Components/Header';
import TabBar from '../Components/TabBar';

import Beds from './Beds';
import RingDown from './RingDown';

export default function EMS() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [history, setHistory] = useState({});

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    return history;
  };

  return (
    <>
      <Header name="Hospital Destination Tool">
        <TabBar onSelect={setSelectedTab} tabs={['Ringdown', 'Hospital Info']} />
      </Header>
      {selectedTab === 0 && <RingDown history={history} saveHistory={saveHistory} />}
      {selectedTab === 1 && <Beds />}
    </>
  );
}
