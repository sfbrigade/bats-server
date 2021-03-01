import React from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';

function RingdownEta({ className, ringdown }) {
  const arrivalTime = DateTime.fromISO(ringdown.patientDelivery.ringdownSentDateTimeLocal).plus({
    minutes: ringdown.patientDelivery.etaMinutes,
  });

  return <span className={classNames('ringdown-eta', className)}>ETA: {arrivalTime.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}</span>;
}

export default RingdownEta;
