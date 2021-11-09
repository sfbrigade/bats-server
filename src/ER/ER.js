import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Header from '../Components/Header';
import TabBar from '../Components/TabBar';
import IncomingRingdown from './IncomingRingdown';

import Context from '../Context';
import Ringdown from '../Models/Ringdown';
import HospitalStatus from '../Models/HospitalStatus';

import Beds from './Beds';
import RingDowns from './Ringdowns';

export default function ER() {
  const { hospital } = useContext(Context);
  const { user } = useContext(Context)
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/hospital?id=${hospital?.id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });

  const [selectedTab, setSelectedTab] = useState(0);
  const [ringdowns, setRingdowns] = useState([]);
  const [incomingRingdowns, setIncomingRingdowns] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  function onConfirm(ringdown) {
    const newIncomingRingdowns = incomingRingdowns.filter((r) => r.id !== ringdown.id);
    setIncomingRingdowns(newIncomingRingdowns);
  }

  function onStatusUpdate(newStatusUpdate) {
    setStatusUpdate(newStatusUpdate);
  }

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      data.ringdowns = data.ringdowns.map((r) => new Ringdown(r));
      const newRingdowns = data.ringdowns.sort((a, b) => a.etaDateTimeLocalObj.toMillis() - b.etaDateTimeLocalObj.toMillis());
      const newIncomingRingdowns = data.ringdowns.filter((r) => r.currentDeliveryStatus === Ringdown.Status.RINGDOWN_SENT);
      setRingdowns(newRingdowns);
      setIncomingRingdowns(newIncomingRingdowns);
      setStatusUpdate(new HospitalStatus(data.statusUpdate));
    }
  }, [lastMessage, setRingdowns, setIncomingRingdowns, setStatusUpdate]);
  //optional chaining
  console.log("help", user?.hospitaluser)

  return (
    <>
      <Header name="Hospital Destination Tool">
        {incomingRingdowns.length === 0 && (
           <TabBar onSelect={setSelectedTab} selectedTab={selectedTab} tabs={['Ringdowns', 'Hospital Info']} />
        )}
      </Header>
      { !user?.hospitaluser.infouserindicator && incomingRingdowns.length > 0 && <IncomingRingdown onConfirm={onConfirm} ringdown={incomingRingdowns[0]} />}
      { !user?.hospitaluser.infouserindicator && incomingRingdowns.length === 0 && selectedTab === 0 && <RingDowns ringdowns={ringdowns} />}
      { !user?.hospitaluser.infouserindicator && incomingRingdowns.length === 0 && selectedTab === 1 && <Beds statusUpdate={statusUpdate} onStatusUpdate={onStatusUpdate} />}
      { user?.hospitaluser.infouserindicator && <Beds statusUpdate={statusUpdate} onStatusUpdate={onStatusUpdate} />}
    </>
  );
}
// user?.hospitaluser.ringdownuserindicator
// user?.hospitaluser.infouserindicator &&