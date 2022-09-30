import React from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import RingdownSection from './RingdownSection';

function Ringdowns({ ringdowns, onStatusChange }) {
  const waiting = ringdowns.filter(
    (r) => r.currentDeliveryStatus === Ringdown.Status.ARRIVED || r.currentDeliveryStatus === Ringdown.Status.OFFLOADED
  );

  const enroute = ringdowns.filter(
    (r) =>
      r.currentDeliveryStatus !== Ringdown.Status.ARRIVED &&
      r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED_ACKNOWLEDGED &&
      r.currentDeliveryStatus !== Ringdown.Status.CANCEL_ACKNOWLEDGED &&
      r.currentDeliveryStatus !== Ringdown.Status.REDIRECT_ACKNOWLEDGED &&
      r.currentDeliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
  );

  return (
    <>
      <div className="usa-accordion ringdowns">
        <RingdownSection title="Waiting" ringdowns={waiting} onStatusChange={onStatusChange} />
        <RingdownSection title="Incoming" ringdowns={enroute} onStatusChange={onStatusChange} />
      </div>
    </>
  );
}

Ringdowns.propTypes = {
  ringdowns: PropTypes.arrayOf(PropTypes.instanceOf(Ringdown)).isRequired,
  onStatusChange: PropTypes.instanceOf(Function).isRequired,
};

export default Ringdowns;
