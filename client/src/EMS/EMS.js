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
  const [selectedTab, setSelectedTab] = useState('ringdownForm');

  const [scrollTopPositions, setScrollTopPositions] = useState({
    ringdownForm: 0,
    hospitalStatuses: 0,
  });

  const handleSelectTab = (id) => {
    const currentScrollY = window.scrollY;
    setSelectedTab((current) => {
      setScrollTopPositions({
        ...scrollTopPositions,
        [current]: currentScrollY,
      });
      return id;
    });
  };

  useEffect(() => {
    console.log('useEffect');
    window.scrollTo(0, scrollTopPositions[selectedTab]);
  }, [selectedTab, scrollTopPositions]);

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setRingdowns(data.ringdowns.map((r) => new Ringdown(r)));
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
    }

    return setScrollTopPositions({
      ringdownForm: 0,
      hospitalStatuses: 0,
    });
  }, [lastMessage, setRingdowns, setStatusUpdates]);

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <RoutedHeader selectedTab={selectedTab} onSelect={handleSelectTab} />
          <RingdownForm className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 'ringdownForm' })} />
          <HospitalStatuses
            onReturn={() => handleSelectTab('rindownForm')}
            className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 'hospitalStatuses' })}
          />
        </div>
      </div>
    </div>
  );
}
