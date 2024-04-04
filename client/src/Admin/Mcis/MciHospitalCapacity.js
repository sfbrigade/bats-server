import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { DateTime } from 'luxon';

import HospitalStatus from '../../Models/HospitalStatus';
import Ringdown from '../../Models/Ringdown';
import Spinner from '../../Components/Spinner';

import MciHospitalCapacityRow from './MciHospitalCapacityRow';
import MciPatientCounts from './MciPatientCounts';
import ApiService from '../../ApiService';

function MciHospitalCapacity({ id, onError }) {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/mci?id=${id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const [statusUpdates, setStatusUpdates] = useState();
  const [ringdowns, setRingdowns] = useState();

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
      setRingdowns(data.ringdowns.map((rd) => new Ringdown(rd)));
    }
  }, [lastMessage]);

  async function onChangeHospitalStatus(newStatusUpdate) {
    try {
      const { hospitalId, mciRedCapacity, mciYellowCapacity, mciGreenCapacity } = newStatusUpdate;
      const now = DateTime.now().toISO();
      const data = {
        hospitalId,
        mciRedCapacity,
        mciYellowCapacity,
        mciGreenCapacity,
        mciUpdateDateTime: now,
        updateDateTimeLocal: now,
      };
      const oldStatusUpdate = statusUpdates.find((su) => su.hospitalId === newStatusUpdate.hospitalId);
      oldStatusUpdate.mciRedCapacity = mciRedCapacity;
      oldStatusUpdate.mciYellowCapacity = mciYellowCapacity;
      oldStatusUpdate.mciGreenCapacity = mciGreenCapacity;
      oldStatusUpdate.mciUpdateDateTime = now;
      oldStatusUpdate.updateDateTimeLocal = now;
      setStatusUpdates([...statusUpdates]);
      await ApiService.hospitalStatuses.create(data);
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

  let transportedTotals;
  ringdowns?.forEach((rd) => {
    transportedTotals = transportedTotals ?? {
      estimatedRedCount: 0,
      estimatedYellowCount: 0,
      estimatedGreenCount: 0,
    };
    switch (rd.triagePriority) {
      case 'RED':
        transportedTotals.estimatedRedCount += 1;
        break;
      case 'YELLOW':
        transportedTotals.estimatedYellowCount += 1;
        break;
      case 'GREEN':
        transportedTotals.estimatedGreenCount += 1;
        break;
      default:
        break;
    }
  });

  return (
    <>
      <h2>Transported Patients</h2>
      {transportedTotals && <MciPatientCounts className="margin-bottom-3" data={transportedTotals} isEditable={false} />}
      <h2>Hospital Capacity</h2>
      {!statusUpdates && <Spinner />}
      {totals && <MciPatientCounts className="margin-bottom-3" data={totals} isEditable={false} />}
      {statusUpdates?.map((su) => (
        <MciHospitalCapacityRow key={su.hospitalId} onChange={onChangeHospitalStatus} statusUpdate={su} />
      ))}
    </>
  );
}

export default MciHospitalCapacity;
