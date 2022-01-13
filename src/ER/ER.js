import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Header from '../Components/Header';
import TabBar from '../Components/TabBar';
import UnconfirmedRingdowns from './UnconfirmedRingdowns';

import Context from '../Context';
import Ringdown from '../Models/Ringdown';
import HospitalStatus from '../Models/HospitalStatus';

import Beds from './Beds';
import Ringdowns from './Ringdowns';

export default function ER() {
  const { hospital } = useContext(Context);
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/hospital?id=${hospital?.hospital.id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });

  const [selectedTab, setSelectedTab] = useState(1);
  const [ringdowns, setRingdowns] = useState([]);
  const [unconfirmedRingdowns, setUnconfirmedRingdowns] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState(new HospitalStatus({}));

  function onConfirm(ringdown) {
    const newUnconfirmedRingdowns = unconfirmedRingdowns.filter((r) => r.id !== ringdown.id);
    setUnconfirmedRingdowns(newUnconfirmedRingdowns);
  }

  function onStatusUpdate(newStatusUpdate) {
    setStatusUpdate(newStatusUpdate);
  }

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      data.ringdowns = data.ringdowns.map((r) => new Ringdown(r));
      const newRingdowns = data.ringdowns.sort((a, b) => a.etaDateTimeLocalObj.toMillis() - b.etaDateTimeLocalObj.toMillis());
      const newUnconfirmedRingdowns = data.ringdowns.filter(
        (r) => r.currentDeliveryStatus === Ringdown.Status.RINGDOWN_SENT || r.currentDeliveryStatus === Ringdown.Status.RINGDOWN_RECEIVED
      );
      setRingdowns(newRingdowns);
      setUnconfirmedRingdowns(newUnconfirmedRingdowns);
      setStatusUpdate(new HospitalStatus(data.statusUpdate));
    }
  }, [lastMessage, setRingdowns, setUnconfirmedRingdowns, setStatusUpdate]);

  const showRingdown = hospital?.isRingdownUser;
  const showInfo = hospital?.isInfoUser;
  const showTabs = showRingdown && showInfo;
  const hasUnconfirmedRingdowns = unconfirmedRingdowns.length > 0;
  const incomingRingdownsCount = ringdowns.filter(
    (r) =>
      r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.currentDeliveryStatus !== Ringdown.Status.CANCELLED &&
      r.currentDeliveryStatus !== Ringdown.Status.REDIRECTED
  ).length;

  return (
    <>
      <Header name={hospital?.hospital.name || 'Hospital Destination Tool'}>
        {showTabs && !hasUnconfirmedRingdowns && (
          <TabBar onSelect={setSelectedTab} selectedTab={selectedTab} tabs={['Ringdowns', 'Hospital Info']} />
        )}
      </Header>
      {showRingdown && hasUnconfirmedRingdowns && <UnconfirmedRingdowns onConfirm={onConfirm} ringdown={unconfirmedRingdowns[0]} />}
      {showRingdown && !hasUnconfirmedRingdowns && (!showTabs || selectedTab === 0) && <Ringdowns ringdowns={ringdowns} />}
      {showInfo && (!showTabs || (!hasUnconfirmedRingdowns && selectedTab === 1)) && (
        <Beds statusUpdate={statusUpdate} onStatusUpdate={onStatusUpdate} incomingRingdownsCount={incomingRingdownsCount} />
      )}
    </>
  );
}
