import React, { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Card from './Card';
import Drawer from './Drawer';
import Ringdown from '../Models/Ringdown';
import RingdownDetails from './RingdownDetails';
import RingdownEta from './RingdownEta';
import './RingdownCard.scss';

function RingdownCard({ className, ringdown }) {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Card
      className={classNames(
        'ringdown-card',
        { 'ringdown-card--offloaded': ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED },
        className
      )}
      header={isExpanded && ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED ? null : `Incident #${ringdown.dispatchCallNumber}`}
      body={isExpanded && ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED ? null : ringdown.chiefComplaintDescription}
    >
      {ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED && (
        
        <span className="ringdown-eta ringdown-card__eta">
          <span className="ringdown-eta__prefix">Offloaded: </span>
          {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.OFFLOADED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
        </span>
      )}
      {ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED && (
        <Drawer
          title={<RingdownEta className="ringdown-card__eta" ringdown={ringdown} />}
          isOpened={isExpanded}
          onToggle={() => setExpanded(!isExpanded)}
        >
          <RingdownDetails ringdown={ringdown} />
        </Drawer>
      )}
    </Card>
  );
}

RingdownCard.propTypes = {
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
};

RingdownCard.defaultProps = {
  className: null,
};

export default RingdownCard;
