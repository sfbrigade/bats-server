import React from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import Ringdown from '../Models/Ringdown';

function RingdownEta({ className, prefix, ringdown }) {
  return (
    <>
      {ringdown.etaDateTimeLocalObj && (
        <span className={classNames('ringdown-eta', className)}>
          <span className="ringdown-eta__prefix">{prefix}</span>
          {ringdown.etaDateTimeLocalObj.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
        </span>
      )}
    </>
  );
}

RingdownEta.propTypes = {
  className: PropTypes.string,
  prefix: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
};

RingdownEta.defaultProps = {
  className: null,
  prefix: 'ETA: ',
};

export default RingdownEta;
