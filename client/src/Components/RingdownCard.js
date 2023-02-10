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
import { DateTime } from 'luxon';

const { Status } = Ringdown;
const AcknowledgedStatus = {
  [Status.OFFLOADED]: Status.OFFLOADED_ACKNOWLEDGED,
  [Status.CANCELLED]: Status.CANCEL_ACKNOWLEDGED,
  [Status.REDIRECTED]: Status.REDIRECT_ACKNOWLEDGED,
};

function RingdownCard({ children, className, ringdown, dismissable, onStatusChange }) {
  const [isExpanded, setExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { currentDeliveryStatus, chiefComplaintDescription, etaDateTimeLocalObj, timestamps } = ringdown;

  function handleDismiss() {
    setShowConfirmation(false);
    onStatusChange(ringdown, AcknowledgedStatus[currentDeliveryStatus]);
  }

  const canBeDismissed =
    dismissable &&
    (currentDeliveryStatus === Status.OFFLOADED ||
      currentDeliveryStatus === Status.CANCELLED ||
      currentDeliveryStatus === Status.REDIRECTED);
  const drawerTitle =
    currentDeliveryStatus === Status.OFFLOADED ? (
      <RingdownBadge status={currentDeliveryStatus} />
    ) : (
      <Timestamp
        className="ringdown-card__status"
        label={Status.ARRIVED ? 'Arrived At:' : 'ETA:'}
        time={Status.ARRIVED ? DateTime.fromISO(timestamps.ARRIVED) : etaDateTimeLocalObj}
      />
    );

  // Below is a secondary option that may provide more clarity than the solution above if we reassign drawerTitle to be a let variable.
  // switch(currentDeliveryStatus) {
  //   case Status.OFFLOADED:
  //     drawerTitle =  <RingdownBadge status={currentDeliveryStatus} />;
  //   case Status.ARRIVED:
  //     drawerTitle =  <Timestamp className="ringdown-card__status" label="Arrived At:" time={timestamps.ARRIVED} />
  //   default:
  //     drawerTitle =  <Timestamp className="ringdown-card__status" label="ETA:" time={etaDateTimeLocalObj} />
  // }

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
          <div className="ringdown-card__complaint-summary">{chiefComplaintDescription}</div>
        </>
      )}
      {!canBeDismissed && (
        <Drawer
          title={drawerTitle}
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
  dismissable: PropTypes.bool,
  onStatusChange: PropTypes.instanceOf(Function),
};

RingdownCard.defaultProps = {
  children: undefined,
  className: undefined,
  dismissable: true,
  onStatusChange: undefined,
};

export default RingdownCard;
