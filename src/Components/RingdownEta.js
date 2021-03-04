import React from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

function RingdownEta({ className, prefix, ringdown }) {
  const arrivalTime = DateTime.fromISO(ringdown.patientDelivery.ringdownSentDateTimeLocal).plus({
    minutes: ringdown.patientDelivery.etaMinutes,
  });

  return (
    <span className={classNames('ringdown-eta', className)}>
      <span className="ringdown-eta__prefix">{prefix}</span>
      {arrivalTime.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
    </span>
  );
}

RingdownEta.propTypes = {
  className: PropTypes.string,
  prefix: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  ringdown: PropTypes.object.isRequired,
};

RingdownEta.defaultProps = {
  className: null,
  prefix: 'ETA: ',
};

export default RingdownEta;
