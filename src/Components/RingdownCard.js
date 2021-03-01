import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import RingdownEta from './RingdownEta';

function RingdownCard({ className, ringdown }) {
  return (
    <Card className={classNames('ringdown-card', className)} header={`Incident #${ringdown.emsCall.dispatchCallNumber}`}>
      {ringdown.patient.chiefComplaintDescription}
      <br />
      <RingdownEta ringdown={ringdown} />
    </Card>
  );
}

export default RingdownCard;
