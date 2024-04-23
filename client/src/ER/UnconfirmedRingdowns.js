import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';
import RingdownCard from '../Components/RingdownCard';
import Ringdown from '../Models/Ringdown';
import './UnconfirmedRingdowns.scss';

const UnconfirmedRingdowns = ({ onConfirm, ringdowns }) => {
  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'instant' });
    document.querySelector('html').classList.add('no-scroll');
    document.querySelector('body').classList.add('no-scroll');
    return () => {
      document.querySelector('html').classList.remove('no-scroll');
      document.querySelector('body').classList.remove('no-scroll');
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    ringdowns.forEach((ringdown) => {
      if (isCancelled) return;
      if (!ringdown.timestamps[Ringdown.Status.RINGDOWN_RECEIVED]) {
        try {
          ApiService.ringdowns.setDeliveryStatus(ringdown.id, 'RINGDOWN RECEIVED', new Date());
        } catch {}
      }
    });
    return () => (isCancelled = true);
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
    <div className="unconfirmed-ringdowns">
      <div className="unconfirmed-ringdowns__container">
        <h2>New Ringdowns</h2>
        <div>
          {ringdowns.slice(0, 3).map((ringdown) => (
            <RingdownCard key={ringdown.id} ringdown={ringdown}>
              <div className="unconfirmed-ringdowns__confirm">
                <button type="button" className="usa-button width-full" onClick={() => confirm(ringdown)}>
                  Confirm Receipt
                </button>
              </div>
            </RingdownCard>
          ))}
        </div>
        {ringdowns.length > 3 && <h2 className="unconfirmed-ringdowns__more">+ {ringdowns.length - 3} More</h2>}
      </div>
    </div>
  );
};

UnconfirmedRingdowns.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  ringdowns: PropTypes.arrayOf(PropTypes.instanceOf(Ringdown)).isRequired,
};

export default UnconfirmedRingdowns;
