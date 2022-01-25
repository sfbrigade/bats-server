import React from 'react';
import PropTypes from 'prop-types';
import ApiService from '../ApiService';

import Heading from '../Components/Heading';
import RingdownCard from '../Components/RingdownCard';
import Ringdown from '../Models/Ringdown';
import RingdownSection from './RingdownSection';

function Ringdowns({ ringdowns }) {
  const waiting = ringdowns.filter(
    (r) => r.currentDeliveryStatus === Ringdown.Status.ARRIVED || r.currentDeliveryStatus === Ringdown.Status.OFFLOADED
  );

  const enroute = ringdowns.filter(
    (r) =>
      r.currentDeliveryStatus !== Ringdown.Status.ARRIVED &&
      r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.currentDeliveryStatus !== Ringdown.Status.CANCEL_ACKNOWLEDGED &&
      r.currentDeliveryStatus !== Ringdown.Status.REDIRECT_ACKNOWLEDGED &&
      r.currentDeliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
  );

  function onStatusChange(rd, status) {
    // submit to server
    const now = new Date();
    ApiService.ringdowns.setDeliveryStatus(rd.id, status, now);
    // update local object for immediate feedback
    rd.currentDeliveryStatus = status;
  }

  return (
    <>
      <div className="usa-accordion ringdowns">
        <RingdownSection title="Waiting" ringdowns={waiting} />
        <RingdownSection title="Incoming" ringdowns={enroute} />
      </div>
    </>
  );
}

Ringdowns.propTypes = {
  ringdowns: PropTypes.arrayOf(PropTypes.instanceOf(Ringdown)).isRequired,
};

export default Ringdowns;
