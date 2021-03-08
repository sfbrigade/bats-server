import React, { useState } from 'react';
import classNames from 'classnames';
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
        { 'ringdown-card--offloaded': ringdown.deliveryStatus === Ringdown.Status.OFFLOADED },
        className
      )}
      header={isExpanded ? null : `Incident #${ringdown.dispatchCallNumber}`}
      body={isExpanded ? null : ringdown.chiefComplaintDescription}
    >
      {ringdown.deliveryStatus === Ringdown.Status.OFFLOADED && (
        <RingdownEta className="ringdown-card__eta" prefix="Offloaded: " ringdown={ringdown} />
      )}
      {ringdown.deliveryStatus !== Ringdown.Status.OFFLOADED && (
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
