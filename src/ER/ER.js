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

export default function ER() {
  const { hospitalUser } = useContext(Context);
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/hospital?id=${hospitalUser?.hospital.id}`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });

  const [selectedTab, setSelectedTab] = useState(1);
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
  }, [lastMessage, setRingdowns, setUnconfirmedRingdowns, setStatusUpdate, showRingdown, playSound]);

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
          <RoutedHeader selectedTab={selectedTab} onSelect={setSelectedTab} />
          {showRingdown && (!showTabs || selectedTab === 0) && <Ringdowns ringdowns={ringdowns} onStatusChange={onStatusChange} />}
          {showInfo && (!showTabs || selectedTab === 1) && (
            <Beds statusUpdate={statusUpdate} onStatusUpdate={onStatusUpdate} incomingRingdownsCount={incomingRingdownsCount} />
          )}
          {showRingdown && hasUnconfirmedRingdowns && <UnconfirmedRingdowns onConfirm={onConfirm} ringdowns={unconfirmedRingdowns} />}
        </div>
      </div>
    </div>
  );
}
