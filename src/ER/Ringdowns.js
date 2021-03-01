import React from 'react';
import PropTypes from 'prop-types';

import RingdownCard from '../Components/RingdownCard';
import Ringdown from '../Models/Ringdown';

function Ringdowns({ ringdowns }) {
  const waiting = ringdowns.filter(
    (r) => r.patientDelivery.deliveryStatus === Ringdown.Status.ARRIVED || r.patientDelivery.deliveryStatus === Ringdown.Status.OFFLOADED
  );
  const enroute = ringdowns.filter(
    (r) =>
      r.patientDelivery.deliveryStatus !== Ringdown.Status.ARRIVED &&
      r.patientDelivery.deliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.patientDelivery.deliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
  );

  return (
    <>
      <div className="usa-accordion">
        {waiting.length > 0 && (
          <>
            <h3 className="usa-accordion__heading">Waiting</h3>
            {waiting.map((r) => (
              <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} />
            ))}
          </>
        )}
        {enroute.length > 0 && (
          <>
            <h3 className="usa-accordion__heading">En route</h3>
            {enroute.map((r) => (
              <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

Ringdowns.propTypes = {
  ringdowns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Ringdowns;
