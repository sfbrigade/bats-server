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

  const canBeDismissed =
    ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED ||
    ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED ||
    ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED;

  const backgroundClass = canBeDismissed ? 'ringdown-card__background' : null;

  return (
    <div className={classNames('ringdown-card height-auto', className, backgroundClass)}>
      {ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED && (
        <div className="ringdown-card__header">
          <span className="ringdown-card__status ringdown-card--cancelled">Cancelled</span>
          <button type="button" onClick={() => setShowCancel(true)}>
            Dismiss
          </button>
        </div>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED && (
        <div className="ringdown-card__header">
          <span className="ringdown-card__status ringdown-card--redirected">Redirected</span>
          <button type="button" onClick={() => setShowRedirect(true)}>
            Dismiss
          </button>
        </div>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED && (
        <div className="ringdown-card__header">
          <span className="ringdown-card__status ringdown-card--offloaded">Offloaded</span>
          <button type="button" onClick={() => setShowRedirect(true)}>
            Dismiss
          </button>
        </div>
      )}
      {canBeDismissed && <div className="ringdown-card__body flex-auto">{ringdown.chiefComplaintDescription}</div>}
      {!canBeDismissed && (
        <Drawer
          title={<RingdownEta className="ringdown-card__status" ringdown={ringdown} />}
          subtitle={<div className="ringdown-card__body flex-auto">{ringdown.chiefComplaintDescription}</div>}
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
    </div>
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
