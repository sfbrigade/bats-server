import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ApiService from '../ApiService';
import RingdownDetails from '../Components/RingdownDetails';
import RingdownEta from '../Components/RingdownEta';
import Ringdown from '../Models/Ringdown';
import './UnconfirmedRingdowns.scss';

const UnconfirmedRingdowns = ({ onConfirm, ringdowns }) => {
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    for (const ringdown of ringdowns) {
      if (!ringdown.timestamps[Ringdown.Status.RINGDOWN_RECEIVED]) {
        ApiService.ringdowns.setDeliveryStatus(ringdown.id, 'RINGDOWN RECEIVED', new Date());
      }
    }
  }, [ringdowns]);

  async function confirm(ringdown) {
    try {
      const response = await ApiService.ringdowns.setDeliveryStatus(ringdown.id, 'RINGDOWN CONFIRMED', new Date());
      onConfirm(response.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  return (
    <div className={classNames('unconfirmed-ringdowns-container', { 'unconfirmed-ringdowns-container--viewed': isViewed })}>
      <div className="unconfirmed-ringdowns">
        {isViewed && (
          <>
            <div className="unconfirmed-ringdowns__details">
              <RingdownDetails isIncoming ringdown={ringdowns[0]} />
            </div>
            <button className="usa-button width-full" onClick={() => confirm(ringdowns[0])} type="button">
              Confirm Receipt
            </button>
          </>
        )}
        {!isViewed && (
          <>
            <h1>
              Incoming
              <br />
              Ringdown
            </h1>
            <h2>
              <RingdownEta ringdown={ringdowns[0]} />
            </h2>
            <button className="usa-button width-full" onClick={() => setIsViewed(true)} type="button">
              View ringdown
            </button>
          </>
        )}
      </div>
    </div>
  );
};

UnconfirmedRingdowns.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  ringdowns: PropTypes.arrayOf(PropTypes.instanceOf(Ringdown)).isRequired,
};

export default UnconfirmedRingdowns;
