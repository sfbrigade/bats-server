import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import HospitalStatus from '../../Models/HospitalStatus';
import Spinner from '../../Components/Spinner';

import MciHospitalCapacityRow from './MciHospitalCapacityRow';
import MciPatientCounts from './MciPatientCounts';
import ApiService from '../../ApiService';

function MciHospitalCapacity({ onError }) {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/user`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const [statusUpdates, setStatusUpdates] = useState();

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
    }
  }, [lastMessage]);

  async function onChangeHospitalStatus(newStatusUpdate) {
    try {
      const { hospitalId, mciRedCapacity, mciYellowCapacity, mciGreenCapacity } = newStatusUpdate;
      await ApiService.hospitalStatuses.create({
        hospitalId,
        mciRedCapacity,
        mciYellowCapacity,
        mciGreenCapacity,
      });
    } catch (error) {
      onError(error);
    }
  }

  let totals;
  statusUpdates?.forEach((su) => {
    totals = totals ?? {};
    totals.estimatedRedCount = (totals.estimatedRedCount ?? 0) + (su.mciRedCapacity ?? 0);
    totals.estimatedYellowCount = (totals.estimatedYellowCount ?? 0) + (su.mciYellowCapacity ?? 0);
    totals.estimatedGreenCount = (totals.estimatedGreenCount ?? 0) + (su.mciGreenCapacity ?? 0);
  });
  return (
    <>
      {!statusUpdates && <Spinner />}
      {totals && <MciPatientCounts className="margin-bottom-3" data={totals} isEditable={false} />}
      {statusUpdates?.map((su) => (
        <MciHospitalCapacityRow key={su.id} onChange={onChangeHospitalStatus} statusUpdate={su} />
      ))}
    </>
  );
}

export default MciHospitalCapacity;
