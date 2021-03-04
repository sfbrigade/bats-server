import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import RingdownEta from './RingdownEta';
import './RingdownCard.scss';

function RingdownCard({ className, ringdown }) {
  return (
    <Card
      className={classNames('ringdown-card', className)}
      header={`Incident #${ringdown.emsCall.dispatchCallNumber}`}
      body={ringdown.patient.chiefComplaintDescription}
    >
      <RingdownEta className="ringdown-card__eta" ringdown={ringdown} />
    </Card>
  );
}

export default RingdownCard;
