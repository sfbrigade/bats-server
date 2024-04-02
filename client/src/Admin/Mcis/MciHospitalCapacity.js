import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import HospitalStatus from '../../Models/HospitalStatus';
import Spinner from '../../Components/Spinner';

import MciHospitalCapacityRow from './MciHospitalCapacityRow';

function MciHospitalCapacity() {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/user`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const [statusUpdates, setStatusUpdates] = useState();

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
    }
  }, [lastMessage]);

  return (
    <>
      {!statusUpdates && <Spinner />}
      {statusUpdates?.map((su) => (
        <MciHospitalCapacityRow key={su.id} statusUpdate={su} />
      ))}
    </>
  );
}

export default MciHospitalCapacity;
