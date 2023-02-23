import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import useSound from 'use-sound';

import RoutedHeader from '../Components/RoutedHeader';
import UnconfirmedRingdowns from './UnconfirmedRingdowns';

import ApiService from '../ApiService';
import Context from '../Context';
import Ringdown from '../Models/Ringdown';
import HospitalStatus from '../Models/HospitalStatus';

import Beds from './Beds';
import Ringdowns from './Ringdowns';

import notification from '../assets/notification.mp3';
import { useTabPositions } from '../Components/SelectedTab';

export default function ER() {
  const { hospitalUser } = useContext(Context);
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/hospital?id=${hospitalUser?.hospital.id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const {selectedTab,handleSelectTab } = useTabPositions('ringdown', {
    ringdown: 0,
    hospitalInfo: 0,
  });

  const [ringdowns, setRingdowns] = useState([]);
  const [unconfirmedRingdowns, setUnconfirmedRingdowns] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState();

  const [playSound] = useSound(notification);

  function onConfirm(ringdown) {
    const newUnconfirmedRingdowns = unconfirmedRingdowns.filter((r) => r.id !== ringdown.id);
    setUnconfirmedRingdowns(newUnconfirmedRingdowns);
  }

  function onStatusChange(rd, status) {
    // submit to server
    const now = new Date();
    ApiService.ringdowns.setDeliveryStatus(rd.id, status, now);
    // update local object for immediate feedback
    rd.currentDeliveryStatus = status;
    setRingdowns([...ringdowns]);
  }

  function onStatusUpdate(newStatusUpdate) {
    setStatusUpdate(newStatusUpdate);
  }

  const showRingdown = hospitalUser?.isRingdownUser;
  const showInfo = hospitalUser?.isInfoUser;
  const showTabs = showRingdown && showInfo;
  const hasUnconfirmedRingdowns = unconfirmedRingdowns.length > 0;
  const incomingRingdownsCount = ringdowns.filter(
    (r) =>
      r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.currentDeliveryStatus !== Ringdown.Status.CANCELLED &&
      r.currentDeliveryStatus !== Ringdown.Status.REDIRECTED
  ).length;

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      // for pilot testing, optionally show ringdowns from all hospitals
      // and mark as TEST ONLY, NO ARRIVAL when not for this hospital
      if (hospitalUser?.hospital.id && window.env.REACT_APP_PILOT_SHOW_ALL_RINGDOWNS === 'true') {
        data.ringdowns = data.ringdowns.map((r) => {
          if (r.hospital.id !== hospitalUser.hospital.id) {
            r.patient.chiefComplaintDescription = `TEST ONLY, NO ARRIVAL. ${r.patient.chiefComplaintDescription}`;
          }
          return r;
        });
      }
      data.ringdowns = data.ringdowns.map((r) => new Ringdown(r));
      const newRingdowns = data.ringdowns.sort((a, b) => a.etaDateTimeLocalObj.toMillis() - b.etaDateTimeLocalObj.toMillis());
      const newUnconfirmedRingdowns = data.ringdowns.filter(
        (r) => r.currentDeliveryStatus === Ringdown.Status.RINGDOWN_SENT || r.currentDeliveryStatus === Ringdown.Status.RINGDOWN_RECEIVED
      );
      setRingdowns(newRingdowns);
      setUnconfirmedRingdowns(newUnconfirmedRingdowns);
      setStatusUpdate(new HospitalStatus(data.statusUpdate));
      if (showRingdown && newUnconfirmedRingdowns.length > 0) {
        playSound();
      }
    }
  }, [hospitalUser, lastMessage, setRingdowns, setUnconfirmedRingdowns, setStatusUpdate, showRingdown, playSound]);

  useEffect(() => {
    if (hasUnconfirmedRingdowns) {
      document.documentElement.classList.add('no-scrolling');
    } else {
      document.documentElement.classList.remove('no-scrolling');
    }
  }, [hasUnconfirmedRingdowns]);

  return (
    <div className="grid-container minh-100vh">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <RoutedHeader selectedTab={selectedTab} onSelect={handleSelectTab} />
          {showRingdown && (!showTabs || selectedTab === 'ringdown') && <Ringdowns ringdowns={ringdowns} onStatusChange={onStatusChange} />}
          {showInfo && (!showTabs || selectedTab === 'hospitalInfo') && (
            <Beds statusUpdate={statusUpdate} onStatusUpdate={onStatusUpdate} incomingRingdownsCount={incomingRingdownsCount} />
          )}
          {showRingdown && hasUnconfirmedRingdowns && <UnconfirmedRingdowns onConfirm={onConfirm} ringdowns={unconfirmedRingdowns} />}
        </div>
      </div>
    </div>
  );
}
