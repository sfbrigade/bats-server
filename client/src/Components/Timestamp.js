import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import './Timestamp.scss';

export default function Timestamp({ className, label, time }) {
  const timeString = time && DateTime.fromISO(time).toLocaleString(DateTime.TIME_SIMPLE);

  return (
    <span className={`timestamp ${className}`}>
      {label && <span className="timestamp__label">{label}</span>}
      {timeString && <span className="timestamp__time">{timeString}</span>}
    </span>
  );
}

Timestamp.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  time: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(DateTime), PropTypes.instanceOf(Date)]),
};

Timestamp.defaultProps = {
  className: '',
  label: null,
  time: null,
};
