import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Card from './Card';
import Ringdown from '../Models/Ringdown';
import RingdownEta from './RingdownEta';
import './RingdownCard.scss';

function RingdownCard({ className, ringdown }) {
  return (
    <Card
      className={classNames(
        'ringdown-card',
        { 'ringdown-card--offloaded': ringdown.patientDelivery.deliveryStatus === Ringdown.Status.OFFLOADED },
        className
      )}
      header={`Incident #${ringdown.emsCall.dispatchCallNumber}`}
      body={ringdown.patient.chiefComplaintDescription}
    >
      <RingdownEta
        className="ringdown-card__eta"
        prefix={ringdown.patientDelivery.deliveryStatus === Ringdown.Status.OFFLOADED ? 'Offloaded: ' : undefined}
        ringdown={ringdown}
      />
    </Card>
  );
}

RingdownCard.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  ringdown: PropTypes.object.isRequired,
};

RingdownCard.defaultProps = {
  className: null,
};

export default RingdownCard;
