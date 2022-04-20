import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Context from '../Context';
import Header from '../Components/Header';
import TabBar from '../Components/TabBar';
import Ringdown from '../Models/Ringdown';
import HospitalStatus from '../Models/HospitalStatus';

import HospitalStatuses from './HospitalStatuses';
import RingdownForm from './RingdownForm';

export default function EMS() {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/user`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const { setRingdowns, setStatusUpdates } = useContext(Context);

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setRingdowns(data.ringdowns.map((r) => new Ringdown(r)));
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
    }
  }, [lastMessage, setRingdowns, setStatusUpdates]);

  return (
<<<<<<< HEAD
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <Header name="Hospital Destination Tool">
            <TabBar onSelect={setSelectedTab} selectedTab={selectedTab} tabs={['Ringdown', 'Hospital Info']} />
          </Header>
          <RingdownForm className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 0 })} />
          <HospitalStatuses
            onReturn={() => setSelectedTab(0)}
            className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 1 })}
          />
        </div>
      </div>
    </div>
=======
    <>
      <Header name="Routed">
        <TabBar onSelect={setSelectedTab} selectedTab={selectedTab} tabs={['Ringdown', 'Hospital Info']} />
      </Header>
      <RingdownForm className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 0 })} />
      <HospitalStatuses
        onReturn={() => setSelectedTab(0)}
        className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 1 })}
      />
    </>
>>>>>>> master
  );
}
