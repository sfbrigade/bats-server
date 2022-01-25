import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Drawer from './Drawer';
import Ringdown from '../Models/Ringdown';
import RingdownDetails from './RingdownDetails';
import RingdownEta from './RingdownEta';
import Alert from './Alert';
import './RingdownCard.scss';

function RingdownCard({ children, className, ringdown, onStatusChange }) {
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

  return (
    <div
      className={classNames('ringdown-card height-auto', className, {
        'ringdown-card--dismissable': canBeDismissed,
        'ringdown-card--expanded': isExpanded,
        'ringdown-card--cancelled': ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED,
        'ringdown-card--redirected': ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED,
        'ringdown-card--offloaded': ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED,
      })}
    >
      {ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED && (
        <div className="ringdown-card__header">
          <span className="ringdown-card__status">Cancelled</span>
          <button type="button" onClick={() => setShowCancel(true)}>
            Dismiss
          </button>
        </div>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED && (
        <div className="ringdown-card__header">
          <span className="ringdown-card__status">Redirected</span>
          <button type="button" onClick={() => setShowRedirect(true)}>
            Dismiss
          </button>
        </div>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED && (
        <div className="ringdown-card__header">
          <span className="ringdown-card__status">Offloaded</span>
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
  children: PropTypes.node,
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onStatusChange: PropTypes.instanceOf(Function),
};

RingdownCard.defaultProps = {
  children: undefined,
  className: undefined,
  onStatusChange: undefined,
};

export default RingdownCard;
