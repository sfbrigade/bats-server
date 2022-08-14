import React, { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import Alert from '../Components/Alert';
import RingdownCard from '../Components/RingdownCard';
import { StatusList, StatusStep } from './StatusList';

import './RingdownStatus.scss';

const { Status } = Ringdown;

// eslint-disable-next-line react/prop-types
function StatusButton({ label, status, onClick }) {
  return (
    <button type="button" className="usa-button usa-button--primary width-full" onClick={() => onClick(status)}>
      {label}
    </button>
  );
}

// eslint-disable-next-line react/prop-types
function Timestamp({ label, time }) {
  const timeString = time && DateTime.fromISO(time).toLocaleString(DateTime.TIME_WITH_SECONDS);

  return (
    <div>
      {label}
      <span>{timeString}</span>
    </div>
  );
}

function RingdownStatus({ className, onStatusChange, ringdown }) {
  const [showCancel, setShowCancel] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  function handleStatusChange(status) {
    onStatusChange(ringdown, status);
  }

  function handleCancel() {
    setShowCancel(false);
    onStatusChange(ringdown, Status.CANCELLED);
  }

  function handleRedirect() {
    setShowRedirect(false);
    onStatusChange(ringdown, Status.REDIRECTED);
  }

  const { hospital, currentDeliveryStatus, etaMinutes, timestamps } = ringdown;
  let ringdownStatus = 'pending';
  if (timestamps[Status.RINGDOWN_CONFIRMED]) {
    ringdownStatus = 'confirmed';
  } else if (timestamps[Status.RINGDOWN_RECEIVED]) {
    ringdownStatus = 'delivered';
  }

  return (
    <div className={classNames('usa-accordion ringdownstatus', className)}>
      <div className="usa-accordion__content">
        <fieldset className="usa-fieldset">
          <h3 className="h1 margin-0">{hospital.name}</h3>
          <h4 className={`ringdownstatus__label ringdownstatus__label--${ringdownStatus}`}>
            Ringdown Status:&nbsp;
            <span>{ringdownStatus[0].toUpperCase() + ringdownStatus.slice(1)}</span>
          </h4>
          <h4 className="ringdownstatus__label">
            ETA:&nbsp;
            <span>
              {DateTime.fromISO(timestamps[Status.RINGDOWN_SENT]).plus({ minutes: etaMinutes }).toLocaleString(DateTime.TIME_SIMPLE)}
            </span>
          </h4>
          <StatusList>
            <StatusStep isCompleted inactive={<Timestamp label="Ringdown sent" time={timestamps[Status.RINGDOWN_SENT]} />} />
            <StatusStep
              isActive={!Status.is(currentDeliveryStatus, Status.ARRIVED)}
              isCompleted={Status.is(currentDeliveryStatus, Status.ARRIVED)}
              active={<StatusButton label="Mark arrived" status={Status.ARRIVED} onClick={handleStatusChange} />}
              inactive={<Timestamp label="Arrived at ED" time={timestamps[Status.ARRIVED] ?? timestamps[Status.RINGDOWN_CONFIRMED]} />}
            />
            <StatusStep
              isActive={Status.is(currentDeliveryStatus, Status.ARRIVED)}
              isCompleted={Status.is(currentDeliveryStatus, Status.OFFLOADED)}
              active={<StatusButton label="Mark offloaded" status={Status.OFFLOADED} onClick={handleStatusChange} />}
              inactive={<Timestamp label="Patient offloaded" time={timestamps[Status.OFFLOADED]} />}
            />
            <StatusStep
              isActive={Status.is(currentDeliveryStatus, Status.OFFLOADED)}
              active={<StatusButton label="Return to service" status={Status.RETURNED_TO_SERVICE} onClick={handleStatusChange} />}
              inactive="Return to service"
            />
          </StatusList>
        </fieldset>
        {/* only show the Redirect and Cancel buttons if the patient has not been offloaded yet */}
        {!Status.is(currentDeliveryStatus, Status.OFFLOADED) && (
          <fieldset className="usa-fieldset border-top border-base-lighter">
            <button
              className="usa-button usa-button--outline usa-button--secondary width-full"
              type="button"
              onClick={() => setShowRedirect(true)}
            >
              Redirect patient
            </button>
            <button className="usa-button usa-button--secondary width-full margin-top-4" type="button" onClick={() => setShowCancel(true)}>
              Cancel delivery
            </button>
            {showCancel && (
              <Alert
                type="warning"
                title="Cancel delivery?"
                message="The hospital will be notified and the ringdown will be cleared."
                destructive="Yes, cancel delivery"
                cancel="No, don't cancel"
                onDestructive={handleCancel}
                onCancel={() => setShowCancel(false)}
              />
            )}
            {showRedirect && (
              <Alert
                type="warning"
                title="Redirect patient?"
                message="You will need to choose a new hospital destination for the patient."
                destructive="Choose new destination"
                cancel="Keep destination"
                onDestructive={handleRedirect}
                onCancel={() => setShowRedirect(false)}
              />
            )}
          </fieldset>
        )}
        <fieldset className="usa-fieldset border-top border-base-lighter">
          <RingdownCard ringdown={ringdown} />
        </fieldset>
      </div>
    </div>
  );
}

RingdownStatus.propTypes = {
  className: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ringdown: PropTypes.object.isRequired,
};

RingdownStatus.defaultProps = {
  className: null,
};

export default RingdownStatus;
