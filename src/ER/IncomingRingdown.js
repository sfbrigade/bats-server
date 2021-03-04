import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ApiService from '../ApiService';
import RingdownDetails from '../Components/RingdownDetails';
import RingdownEta from '../Components/RingdownEta';
import Ringdown from '../Models/Ringdown';
import './IncomingRingdown.scss';

const IncomingRingDown = ({ onConfirm, ringdown }) => {
  const [isViewed, setIsViewed] = useState(false);

  async function confirm() {
    try {
      const response = await ApiService.ringdowns.setDeliveryStatus(ringdown.id, 'RINGDOWN RECEIVED', new Date());
      onConfirm(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="incoming-ringdown-container">
      <div className="incoming-ringdown">
        {isViewed && (
          <>
            <RingdownDetails ringdown={ringdown} />
            <button className="usa-button width-full" onClick={confirm} type="button">
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
              <RingdownEta ringdown={ringdown} />
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

IncomingRingDown.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
};

export default IncomingRingDown;
