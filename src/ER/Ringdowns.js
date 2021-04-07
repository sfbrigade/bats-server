import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../Components/Heading';
import RingdownCard from '../Components/RingdownCard';
import Ringdown from '../Models/Ringdown';

function Ringdowns({ ringdowns }) {
  const waiting = ringdowns.filter(
    (r) => r.currentDeliveryStatus === Ringdown.Status.ARRIVED || r.currentDeliveryStatus === Ringdown.Status.OFFLOADED
  );
  const enroute = ringdowns.filter(
    (r) =>
      r.currentDeliveryStatus !== Ringdown.Status.ARRIVED &&
      r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.currentDeliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
  );

  return (
    <>
      <div className="usa-accordion ringdowns">
        {waiting.length > 0 && (
          <>
            <Heading title="Waiting" badge={`${waiting.length}`} />
            {waiting.map((r) => (
              <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} />
            ))}
          </>
        )}
        {enroute.length > 0 && (
          <>
            <Heading title="En route" badge={`${enroute.length}`} />
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
  ringdowns: PropTypes.arrayOf(PropTypes.instanceOf(Ringdown)).isRequired,
};

export default Ringdowns;
