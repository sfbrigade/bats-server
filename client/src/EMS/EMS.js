import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useLocation } from 'react-router-dom';

import RoutedHeader from '../Components/RoutedHeader';
import Context from '../Context';
import MassCasualtyIncident from '../Models/MassCasualtyIncident';
import Ringdown from '../Models/Ringdown';
import HospitalStatus from '../Models/HospitalStatus';
import HospitalStatuses from './HospitalStatuses';
import RingdownForm from './RingdownForm';
import { useTabPositions } from '../hooks/useTabPositions';

export default function EMS() {
  const socketUrl = `${window.location.origin.replace(/^http/, 'ws')}/wss/user`;
  const { lastMessage } = useWebSocket(socketUrl, { shouldReconnect: () => true });
  const { setRingdowns, setStatusUpdates } = useContext(Context);
  const [mcis, setMcis] = useState([]);
  const { selectedTab, setScrollTopPositions, handleSelectTab } = useTabPositions('ringdown', {
    ringdown: 0,
    hospitalInfo: 0,
  });
  const { search } = useLocation();
  let defaultPayload = undefined;

  // when we're in development, pull the default payload from the URL search params
  if (process.env.NODE_ENV === 'development') {
    if (search) {
      // we use this just for its payload, since fields are mapped to different payload sub-objects, depending on which model they came from
      const rd = new Ringdown();

      new URLSearchParams(search).forEach((value, key) => {
        const field = Ringdown.Fields[key];

        if (field) {
          const parsedValue = field.parseValueFromString(value);

          if (parsedValue !== undefined) {
            rd[key] = parsedValue;
          }
        }
      });

      defaultPayload = rd.payload;
    }
  }

  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage.data);
      setMcis(data.mcis.map((mci) => new MassCasualtyIncident(mci)));
      setRingdowns(data.ringdowns.map((r) => new Ringdown(r)));
      setStatusUpdates(data.statusUpdates.map((su) => new HospitalStatus(su)));
    }

    return setScrollTopPositions({
      ringdownForm: 0,
      hospitalStatuses: 0,
    });
  }, [lastMessage, setRingdowns, setStatusUpdates, setScrollTopPositions]);

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <RoutedHeader selectedTab={selectedTab} onSelect={handleSelectTab} />
          <RingdownForm
            defaultPayload={defaultPayload}
            className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 'ringdown' })}
            mcis={mcis}
          />
          <HospitalStatuses
            onReturn={() => handleSelectTab('ringdown')}
            className={classNames('tabbar-content', { 'tabbar-content--selected': selectedTab === 'hospitalInfo' })}
          />
        </div>
      </div>
    </div>
  );
}
