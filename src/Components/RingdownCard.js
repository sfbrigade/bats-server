import React, { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Card from './Card';
import Drawer from './Drawer';
import Ringdown from '../Models/Ringdown';
import RingdownDetails from './RingdownDetails';
import RingdownEta from './RingdownEta';
import Alert from './Alert';
import './RingdownCard.scss';

function RingdownCard({ className, ringdown, onStatusChange }) {
  const [isExpanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  function handleCancel() {
    setShowCancel(false);
    onStatusChange(ringdown, Ringdown.Status.CANCEL_ACKNOWLEDGED);
  }

  function handleRedirect() {
    setShowRedirect(false);
    onStatusChange(ringdown, Ringdown.Status.REDIRECT_ACKNOWLEDGED);
  }

  return (
    <Card
      className={classNames(
        'ringdown-card',
        { 'ringdown-card--offloaded': ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED },
        { 'ringdown-card--cancelled': ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED },
        { 'ringdown-card--cancelled': ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED },
        className
      )}
      header={
        isExpanded && ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED ? null : `Incident #${ringdown.dispatchCallNumber}`
      }
      body={isExpanded && ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED ? null : ringdown.chiefComplaintDescription}
    >
      {ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED && (
        <span className="ringdown-card__eta">
          <span>Cancelled </span>
          <button className="usa-button width-card" type="button" onClick={() => setShowCancel(true)}>
            Dismiss
          </button>
        </span>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED && (
        <span className="ringdown-card__eta">
          <span>Redirected </span>
          <button className="usa-button width-card" type="button" onClick={() => setShowRedirect(true)}>
            Dismiss
          </button>
        </span>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED && (
        <span className="ringdown-card__eta">
          <span>Offloaded: </span>
          {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.OFFLOADED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
        </span>
      )}
      {ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
        ringdown.currentDeliveryStatus !== Ringdown.Status.CANCELLED &&
        ringdown.currentDeliveryStatus !== Ringdown.Status.REDIRECTED && (
          <Drawer
            title={<RingdownEta className="ringdown-card__eta" ringdown={ringdown} />}
            isOpened={isExpanded}
            onToggle={() => setExpanded(!isExpanded)}
          >
            <RingdownDetails ringdown={ringdown} />
          </Drawer>
        )}
      {showCancel && (
        <Alert
          type="warning"
          title="Dismiss Notice"
          message="The Ringdown will be removed from the docket."
          cancel="Keep"
          destructive="Dismiss"
          onDestructive={handleCancel}
          onCancel={() => setShowCancel(false)}
        />
      )}
      {showRedirect && (
        <Alert
          type="warning"
          title="Dismiss Notice"
          message="The Ringdown will be removed from the docket."
          cancel="Keep"
          destructive="Dismiss"
          onDestructive={handleRedirect}
          onCancel={() => setShowRedirect(false)}
        />
      )}
    </Card>
  );
}

RingdownCard.propTypes = {
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onStatusChange: PropTypes.instanceOf(Function),
};

RingdownCard.defaultProps = {
  className: null,
  onStatusChange: null,
};

export default RingdownCard;
