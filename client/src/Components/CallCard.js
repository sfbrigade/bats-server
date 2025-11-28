import { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';

import Alert from './Alert';
import Drawer from './Drawer';
import RingdownBadge from './RingdownBadge';
import RingdownDetails from './RingdownDetails';
import Timestamp from './Timestamp';

import './RingdownCard.scss';

const { Status } = Ringdown;

function CallCard({ call, children, className, onAnswer, onDismiss }) {
  const { status, ringdown: ringdownData, calledAt, answeredAt, cancelledAt } = call;
  const ringdown = new Ringdown(ringdownData);
  const [isExpanded, setExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { triageTag, triagePriority, chiefComplaintDescription, hospitalTeamActivation } = ringdown;

  const isRinging = status === 'ringing';
  const isAnswered = status === 'answered';
  const isCancelled = status === 'cancelled';
  const canBeDismissed = !isRinging;

  const drawerTitle = (
    <Timestamp
      className="ringdown-card__status"
      label={isRinging ? 'Called at' : isAnswered ? 'Answered at' : 'Cancelled at'}
      time={isRinging ? DateTime.fromISO(calledAt) : isAnswered ? DateTime.fromISO(answeredAt) : DateTime.fromISO(cancelledAt)}
    />
  );

  const subtitle = (
    <>
      <div className="ringdown-card__complaint-summary">
        {!!triageTag && `#${triageTag}: `}
        {chiefComplaintDescription}
      </div>
      {!canBeDismissed && (
        <div className="margin-105">
          <button type="button" className="usa-button" onClick={() => onAnswer(call)}>
            Answer
          </button>
        </div>
      )}
    </>
  );

  return (
    <div
      className={classNames('ringdown-card height-auto', className, {
        'ringdown-card--dismissable': canBeDismissed,
        'ringdown-card--expanded': isExpanded,
        'ringdown-card--immediate': triagePriority === 'RED' || !!hospitalTeamActivation,
        'ringdown-card--delayed': triagePriority === 'YELLOW',
        'ringdown-card--minor': triagePriority === 'GREEN',
      })}
    >
      {canBeDismissed && (
        <>
          <div className="ringdown-card__header">
            {isAnswered && drawerTitle}
            {isCancelled && <RingdownBadge status={Status.CANCELLED} />}
            <button type="button" onClick={() => setShowConfirmation(true)}>
              Dismiss
            </button>
          </div>
          {subtitle}
        </>
      )}
      {!canBeDismissed && (
        <Drawer title={drawerTitle} subtitle={subtitle} isOpened={isExpanded} onToggle={() => setExpanded(!isExpanded)}>
          <RingdownDetails ringdown={ringdown} />
          {children}
        </Drawer>
      )}
      {showConfirmation && (
        <Alert
          type="warning"
          title="Dismiss Notice"
          message="The cancelled call will be removed."
          cancel="Keep"
          destructive="Dismiss"
          onDestructive={() => onDismiss(call)}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}

CallCard.propTypes = {
  call: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  onAnswer: PropTypes.instanceOf(Function),
  onDismiss: PropTypes.instanceOf(Function),
};

CallCard.defaultProps = {
  call: undefined,
  children: undefined,
  className: undefined,
  onAnswer: undefined,
  onDismiss: undefined,
};

export default CallCard;
