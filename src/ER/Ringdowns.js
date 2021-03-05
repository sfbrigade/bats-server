import React from 'react';
import PropTypes from 'prop-types';

import RingdownCard from '../Components/RingdownCard';
import Ringdown from '../Models/Ringdown';

import './Ringdowns.scss';

function Ringdowns({ ringdowns }) {
  const waiting = ringdowns.filter((r) => r.deliveryStatus === Ringdown.Status.ARRIVED || r.deliveryStatus === Ringdown.Status.OFFLOADED);
  const enroute = ringdowns.filter(
    (r) =>
      r.deliveryStatus !== Ringdown.Status.ARRIVED &&
      r.deliveryStatus !== Ringdown.Status.OFFLOADED &&
      r.deliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
  );

  return (
    <>
      <div className="usa-accordion ringdowns">
        {waiting.length > 0 && (
          <>
            <h3 className="usa-accordion__heading">
              Waiting <div className="ringdowns__count">{waiting.length}</div>
            </h3>
            {waiting.map((r) => (
              <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} />
            ))}
          </>
        )}
        {enroute.length > 0 && (
          <>
            <h3 className="usa-accordion__heading">
              En route <div className="ringdowns__count">{enroute.length}</div>
            </h3>
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
