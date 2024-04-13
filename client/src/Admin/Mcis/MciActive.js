import { Fragment, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { DateTime } from 'luxon';

import ApiService from '../../ApiService';
import Spinner from '../../Components/Spinner';
import HospitalStatus from '../../Models/HospitalStatus';
import Ringdown from '../../Models/Ringdown';

import MciDetails from './MciDetails';
import MciHospitalCapacityRow from './MciHospitalCapacityRow';
import MciPatientCounts from './MciPatientCounts';

function MciActive({ id, onEnd, onError }) {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/mci`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const [mcis, setMcis] = useState();
  const [statusUpdates, setStatusUpdates] = useState();
  const [allRingdowns, setAllRingdowns] = useState();

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      let allRingdowns = [];
      setMcis(
        data.mcis
          .filter((mci) => !!id || !mci.endedAt)
          .map((mci) => {
            mci.ringdowns = mci.ringdowns.map((rd) => new Ringdown(rd));
            if (!id || mci.id === id) {
              allRingdowns = allRingdowns.concat(mci.ringdowns);
            }
            return mci;
          })
      );
      setAllRingdowns(allRingdowns);
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
      if (id) {
        for (const mci of data.mcis) {
          if (mci.id === id && mci.endedAt) {
            onEnd(mci);
            return;
          }
        }
      }
    }
  }, [lastMessage, id, onEnd]);

  async function onChangeEstimatedPatientCounts(mciId, newData) {
    try {
      const { estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount } = newData;
      await ApiService.mcis.update(mciId, { estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount });
      const newMcis = [...mcis];
      const index = newMcis.findIndex((mci) => mci.id === mciId);
      if (index >= 0) {
        newMcis[index] = { ...newMcis[index], estimatedRedCount, estimatedYellowCount, estimatedGreenCount, estimatedZebraCount };
        setMcis(newMcis);
      }
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

  async function onEndInternal(mciId) {
    try {
      const endedAt = DateTime.now().toISO();
      await ApiService.mcis.update(mciId, { endedAt });
      if (mciId === id) {
        const data = mcis.find((mci) => mci.id === mciId);
        if (data) {
          onEnd({ ...data, endedAt });
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  let totals;
  statusUpdates?.forEach((su) => {
    totals =
      totals ??
      new HospitalStatus({
        hospital: {
          name: 'All Hospitals',
        },
        updateDateTimeLocal: '2000-01-01T00:00:00Z',
      });
    if (DateTime.fromISO(totals.updateDateTimeLocal) < DateTime.fromISO(su.updateDateTimeLocal)) {
      totals.updateDateTimeLocal = su.updateDateTimeLocal;
    }
    totals.mciRedCapacity = (totals.mciRedCapacity ?? 0) + (su.mciRedCapacity ?? 0);
    totals.mciYellowCapacity = (totals.mciYellowCapacity ?? 0) + (su.mciYellowCapacity ?? 0);
    totals.mciGreenCapacity = (totals.mciGreenCapacity ?? 0) + (su.mciGreenCapacity ?? 0);
  });

  let data;
  if (id && mcis) {
    data = mcis.find((mci) => mci.id === id);
  }

  let all;
  if (!id && (mcis?.length ?? 0) > 1) {
    all = {
      updatedAt: '2000-01-01T00:00:00Z',
      estimatedRedCount: 0,
      estimatedYellowCount: 0,
      estimatedGreenCount: 0,
      estimatedZebraCount: 0,
    };
    for (const mci of mcis) {
      if (DateTime.fromISO(all.updatedAt) < DateTime.fromISO(mci.updatedAt)) {
        all.updatedAt = mci.updatedAt;
      }
      all.estimatedRedCount += mci.estimatedRedCount;
      all.estimatedYellowCount += mci.estimatedYellowCount;
      all.estimatedGreenCount += mci.estimatedGreenCount;
      all.estimatedZebraCount += mci.estimatedZebraCount;
    }
  }

  return (
    <>
      {!mcis && <Spinner />}
      {!!data && <MciDetails data={data} onEnd={() => onEndInternal(data.id)} />}
      {!data && !!mcis && !mcis.length && <h3>There are no active MCIs at this time.</h3>}
      {!!mcis?.length && (
        <>
          <h2>Estimated Patient Counts</h2>
          {!mcis && <Spinner />}
          {!!data && (
            <MciPatientCounts
              className="margin-bottom-4"
              data={data}
              ringdowns={data.ringdowns}
              isEditable={!data.isExternallyUpdated}
              onChange={(newData) => onChangeEstimatedPatientCounts(data.id, newData)}
            />
          )}
          {!data &&
            mcis
              ?.filter((mci) => !mci.endedAt)
              .map((mci) => (
                <MciPatientCounts
                  key={mci.id}
                  className="margin-bottom-4"
                  data={mci}
                  ringdowns={mci.ringdowns}
                  isEditable={!mci.isExternallyUpdated}
                  onChange={(newData) => onChangeEstimatedPatientCounts(mci.id, newData)}
                  onEnd={() => onEndInternal(mci.id)}
                  showTransported
                  showEnd
                />
              ))}
          {!!all && <MciPatientCounts className="margin-bottom-4" data={all} ringdowns={allRingdowns} showTransported />}
          <h2 className="margin-top-4">Hospital Capacity</h2>
          {!statusUpdates && <Spinner />}
          {totals && <MciHospitalCapacityRow ringdowns={allRingdowns} statusUpdate={totals} />}
          {statusUpdates?.map((su) => (
            <MciHospitalCapacityRow key={su.hospitalId} onChange={onChangeHospitalStatus} ringdowns={allRingdowns} statusUpdate={su} />
          ))}
        </>
      )}
    </>
  );
}

export default MciActive;
