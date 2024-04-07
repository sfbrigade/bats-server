import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { DateTime } from 'luxon';

import ApiService from '../../ApiService';
import Spinner from '../../Components/Spinner';
import HospitalStatus from '../../Models/HospitalStatus';
import Ringdown from '../../Models/Ringdown';

import MciDetails from './MciDetails';
import MciHospitalCapacityRow from './MciHospitalCapacityRow';
import MciPatientCounts from './MciPatientCounts';
import MciTransportedCounts from './MciTransportedCounts';

function MciActive({ id, onEnd, onError }) {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/mci?id=${id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const [statusUpdates, setStatusUpdates] = useState();
  const [ringdowns, setRingdowns] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
      setRingdowns(data.ringdowns.map((rd) => new Ringdown(rd)));
      setData(data.mci);
      if (data.mci.endedAt) {
        onEnd(data.mci);
      }
    }
  }, [lastMessage, onEnd]);

  async function onChangeEstimatedPatientCounts(newData) {
    try {
      const { estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount } = newData;
      await ApiService.mcis.update(id, { estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount });
      setData({ ...data, estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount });
    } catch (error) {
      onError(error);
    }
  }

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

  async function onEndInternal() {
    try {
      const endedAt = DateTime.now().toISO();
      await ApiService.mcis.update(id, { endedAt });
      onEnd({ ...data, endedAt });
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
      {!data && <Spinner />}
      {data && <MciDetails data={data} onEnd={onEndInternal} />}
      <h2>Estimated Patient Counts</h2>
      {!data && <Spinner />}
      {!!data && <MciPatientCounts className="margin-bottom-4" data={data} isEditable onChange={onChangeEstimatedPatientCounts} />}
      <h2>Transported Patients</h2>
      <MciTransportedCounts ringdowns={ringdowns} />
      <h2>Hospital Capacity</h2>
      {!statusUpdates && <Spinner />}
      {totals && <MciPatientCounts className="margin-bottom-3" data={totals} isEditable={false} />}
      {statusUpdates?.map((su) => (
        <MciHospitalCapacityRow key={su.hospitalId} onChange={onChangeHospitalStatus} ringdowns={ringdowns} statusUpdate={su} />
      ))}
    </>
  );
}

export default MciActive;
