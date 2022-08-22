import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import RoutedHeader from '../Components/RoutedHeader';
import Context from '../Context';
import Ringdown from '../Models/Ringdown';
import HospitalStatus from '../Models/HospitalStatus';
import HospitalStatuses from './HospitalStatuses';
import RingdownForm from './RingdownForm';

export default function EMS() {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/user`;
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
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <RoutedHeader selectedTab={selectedTab} onSelect={setSelectedTab} />
          <RingdownForm className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 0 })} />
          <HospitalStatuses
            onReturn={() => setSelectedTab(0)}
            className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 1 })}
          />
        </div>
      </div>
    </div>
  );
}
