import React, { useContext, useEffect, useState } from 'react';

import Header from '../Components/Header';
import TabBar from '../Components/TabBar';
import IncomingRingdown from './IncomingRingdown';

import ApiService from '../ApiService';
import Context from '../Context';

import Beds from './Beds';
import RingDowns from './Ringdowns';

export default function ER() {
  const { hospital } = useContext(Context);

  const [selectedTab, setSelectedTab] = useState(0);
  const [ringdowns, setRingdowns] = useState([]);
  const [incomingRingdowns, setIncomingRingdowns] = useState([]);

  function onConfirm(ringdown) {
    const newIncomingRingdowns = incomingRingdowns.filter((r) => r.id !== ringdown.id);
    setIncomingRingdowns(newIncomingRingdowns);
  }

  useEffect(() => {
    if (hospital) {
      ApiService.ringdowns.get(hospital.id).then((response) => {
        const newRingdowns = response.data.sort((a, b) => a.patientDelivery.etaMinutes - b.patientDelivery.etaMinutes);
        const newIncomingRingdowns = response.data.filter((r) => r.patientDelivery.deliveryStatus === 'RINGDOWN SENT');
        setRingdowns(newRingdowns);
        setIncomingRingdowns(newIncomingRingdowns);
      });
    }
  }, [hospital, setIncomingRingdowns]);

  return (
    <>
      <Header name="Hospital Destination Tool">
        {incomingRingdowns.length === 0 && (
          <TabBar onSelect={setSelectedTab} selectedTab={selectedTab} tabs={['Ringdowns', 'Hospital Info']} />
        )}
      </Header>
      {incomingRingdowns.length > 0 && <IncomingRingdown onConfirm={onConfirm} ringdown={incomingRingdowns[0]} />}
      {incomingRingdowns.length === 0 && selectedTab === 0 && <RingDowns ringdowns={ringdowns} />}
      {incomingRingdowns.length === 0 && selectedTab === 1 && <Beds />}
    </>
  );
}
