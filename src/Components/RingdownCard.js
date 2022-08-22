import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';

import Alert from './Alert';
import Drawer from './Drawer';
import RingdownBadge from './RingdownBadge';
import RingdownDetails from './RingdownDetails';
import Timestamp from './Timestamp';

import './RingdownCard.scss';

const { Status } = Ringdown;
const AcknowledgedStatus = {
  [Status.OFFLOADED]: Status.OFFLOADED_ACKNOWLEDGED,
  [Status.CANCELLED]: Status.CANCEL_ACKNOWLEDGED,
  [Status.REDIRECTED]: Status.REDIRECT_ACKNOWLEDGED,
};

function RingdownCard({ children, className, ringdown, onStatusChange }) {
  const [isExpanded, setExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { currentDeliveryStatus, chiefComplaintDescription, etaDateTimeLocalObj } = ringdown;

  function handleDismiss() {
    setShowConfirmation(false);
    onStatusChange(ringdown, AcknowledgedStatus[currentDeliveryStatus]);
  }

  const canBeDismissed =
    currentDeliveryStatus === Status.OFFLOADED || currentDeliveryStatus === Status.CANCELLED || currentDeliveryStatus === Status.REDIRECTED;

  return (
    <div
      className={classNames('ringdown-card height-auto', className, {
        'ringdown-card--dismissable': canBeDismissed,
        'ringdown-card--expanded': isExpanded,
      })}
    >
      {canBeDismissed && (
        <>
          <div className="ringdown-card__header">
            <RingdownBadge status={currentDeliveryStatus} />
            <button type="button" onClick={() => setShowConfirmation(true)}>
              Dismiss
            </button>
          </div>
          <div className="ringdown-card__body flex-auto">{chiefComplaintDescription}</div>
        </>
      )}
      {!canBeDismissed && (
        <Drawer
          title={<Timestamp className="ringdown-card__status" label="ETA:" time={etaDateTimeLocalObj} />}
          subtitle={<div className="ringdown-card__complaint-summary">{chiefComplaintDescription}</div>}
          isOpened={isExpanded}
          onToggle={() => setExpanded(!isExpanded)}
        >
          <RingdownDetails ringdown={ringdown} />
          {children}
        </Drawer>
      )}
      {showConfirmation && (
        <Alert
          type="warning"
          title="Dismiss Notice"
          message="The Ringdown will be removed from the docket."
          cancel="Keep"
          destructive="Dismiss"
          onDestructive={handleDismiss}
          onCancel={() => setShowConfirmation(false)}
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
