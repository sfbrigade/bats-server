import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Header from '../Components/Header';
import Beds from './Beds';

import Context from '../Context';
import HospitalStatus from '../Models/HospitalStatus';

export default function AOD() {
  const { hospital } = useContext(Context);
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/hospital?id=${hospital?.id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });

  const [statusUpdate, setStatusUpdate] = useState({});

  function onStatusUpdate(newStatusUpdate) {
    setStatusUpdate(newStatusUpdate);
  }

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setStatusUpdate(new HospitalStatus(data.statusUpdate));
    }
  }, [lastMessage, setStatusUpdate]);

  return (
    <>
      <Header name="Hospital Destination Tool" />
      <Beds statusUpdate={statusUpdate} onStatusUpdate={onStatusUpdate} />
    </>
  );
}
