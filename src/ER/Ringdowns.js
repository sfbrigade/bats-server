import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ApiService from '../ApiService';

import Heading from '../Components/Heading';
import RingdownCard from '../Components/RingdownCard';
import Ringdown from '../Models/Ringdown';

function Ringdowns({ ringdowns }) {
  const [enroute, setEnroute] = useState([]);
  
  const waiting = ringdowns.filter(
    (r) => r.currentDeliveryStatus === Ringdown.Status.ARRIVED || r.currentDeliveryStatus === Ringdown.Status.OFFLOADED
  );

  useEffect(() => {
    // set enroute ringdowns once data comes back from server.
    const handler = setTimeout(() => {
      setEnroute(ringdowns.filter(
        (r) =>
          r.currentDeliveryStatus !== Ringdown.Status.ARRIVED &&
          r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
          r.currentDeliveryStatus !== Ringdown.Status.CANCEL_ACKNOWLEDGED &&
          r.currentDeliveryStatus !== Ringdown.Status.REDIRECT_ACKNOWLEDGED &&
          r.currentDeliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
      ));
    }, 100);
    return () => {
      clearTimeout(handler);
    };
  });

  function onStatusChange(rd, status) {
    // submit to server
    const now = new Date();
    ApiService.ringdowns.setDeliveryStatus(rd.id, status, now);
    // update local object for immediate feedback
    rd.currentDeliveryStatus = status;
    setEnroute(ringdowns.filter(
      (r) =>
        r.currentDeliveryStatus !== Ringdown.Status.ARRIVED &&
        r.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
        r.currentDeliveryStatus !== Ringdown.Status.CANCEL_ACKNOWLEDGED &&
        r.currentDeliveryStatus !== Ringdown.Status.REDIRECT_ACKNOWLEDGED &&
        r.currentDeliveryStatus !== Ringdown.Status.RETURNED_TO_SERVICE
    ));
  }

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
              <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} onStatusChange={onStatusChange} />
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
