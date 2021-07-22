import React, { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import Ringdown from '../Models/Ringdown';
import Alert from '../Components/Alert';

function RingdownStatus({ className, onStatusChange, ringdown }) {
  const [showCancel, setShowCancel] = useState(false);
  const [confirmCancel, setShowConfirmCancel] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [confirmRedirect, setConfirmRedirect] = useState(false);

  function handleCancel() {
    setShowCancel(false);
    onStatusChange(ringdown, Ringdown.Status.CANCELLED);
  }

  function handleRedirect() {
    setShowRedirect(false);
    onStatusChange(ringdown, Ringdown.Status.REDIRECTED);
  }

  return (
    <div className={classNames('usa-accordion', className)}>
      <div className="usa-accordion__content">
        <fieldset className="usa-fieldset">
          <h3 className="h1 margin-0">{ringdown.hospital.name}</h3>
          <h4 className="text-base-light margin-top-2">ETA {ringdown.etaMinutes} minutes</h4>
          <ol className="status-list">
            <li className="status-list-item status-list-item--completed">
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                Ringdown sent{' '}
                <span>
                  {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.RINGDOWN_SENT]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                </span>
              </div>
            </li>
            <li
              className={classNames('status-list-item', {
                'status-list-item--noninteractive': !ringdown.timestamps[Ringdown.Status.RINGDOWN_RECEIVED],
                'status-list-item--completed': ringdown.timestamps[Ringdown.Status.RINGDOWN_RECEIVED],
              })}
            >
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                Ringdown received
                {ringdown.timestamps[Ringdown.Status.RINGDOWN_RECEIVED] && (
                  <span>
                    {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.RINGDOWN_RECEIVED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                  </span>
                )}
              </div>
            </li>
            <li
              className={classNames('status-list-item', {
                'status-list-item--completed':
                  Ringdown.Status.ALL_STATUSES.indexOf(ringdown.currentDeliveryStatus) >=
                  Ringdown.Status.ALL_STATUSES.indexOf(Ringdown.Status.ARRIVED),
              })}
            >
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                {ringdown.currentDeliveryStatus === Ringdown.Status.RINGDOWN_RECEIVED && (
                  <button
                    onClick={() => onStatusChange(ringdown, Ringdown.Status.ARRIVED)}
                    className="usa-button usa-button--primary width-full"
                    type="button"
                  >
                    Mark arrived
                  </button>
                )}
                {ringdown.currentDeliveryStatus !== Ringdown.Status.RINGDOWN_RECEIVED && 'Arrived at ED'}
                {ringdown.timestamps[Ringdown.Status.ARRIVED] && (
                  <span>
                    {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.ARRIVED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                  </span>
                )}
              </div>
            </li>
            <li
              className={classNames('status-list-item', {
                'status-list-item--completed':
                  Ringdown.Status.ALL_STATUSES.indexOf(ringdown.currentDeliveryStatus) >=
                  Ringdown.Status.ALL_STATUSES.indexOf(Ringdown.Status.OFFLOADED),
              })}
            >
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                {ringdown.currentDeliveryStatus === Ringdown.Status.ARRIVED && (
                  <button
                    onClick={() => onStatusChange(ringdown, Ringdown.Status.OFFLOADED)}
                    className="usa-button usa-button--primary width-full"
                    type="button"
                  >
                    Mark offloaded
                  </button>
                )}
                {ringdown.currentDeliveryStatus !== Ringdown.Status.ARRIVED && 'Patient offloaded'}
                {ringdown.timestamps[Ringdown.Status.OFFLOADED] && (
                  <span>
                    {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.OFFLOADED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                  </span>
                )}
              </div>
            </li>
            <li className="status-list-item">
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                {ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED && (
                  <button
                    onClick={() => onStatusChange(ringdown, Ringdown.Status.RETURNED_TO_SERVICE)}
                    className="usa-button usa-button--primary width-full"
                    type="button"
                  >
                    Return to service
                  </button>
                )}
                {ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED && 'Return to service'}
              </div>
            </li>
          </ol>
        </fieldset>
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
              title="Cancel Delivery?"
              message="Patient data will be erased and hospital will be notified."
              cancel="Maintain delivery"
              destructive="Confirm cancel delivery"
              onDestructive={handleCancel}
              onCancel={() => setShowCancel(false)}
            />
          )}
          {confirmCancel && (
            <Alert
              type="warning"
              title="Delivery canceled"
              message="The hospital has been notified."
              cancel="Start new form"
              // destructive="Confirm cancel delivery"
              // onDestructive={handleCancel}
              onCancel={() => setShowCancel(false)}
            />
          )}
          {confirmRedirect && (
            <Alert
              type="warning"
              title="Hospital notified"
              message="Please select a new destination."
              cancel="Return to hospital list"
              destructive="Edit ringdown"
              // onDestructive={handleCancel}
              // onCancel={() => setShowCancel(false)}
            />
          )}
          {showRedirect && (
            <Alert
              type="warning"
              title="Redirect Patient?"
              message="Patient data will be saved and you will be prompted to select a new destination."
              cancel="Maintain destination"
              destructive="Confirm redirect patient"
              onDestructive={handleRedirect}
              onCancel={() => setShowRedirect(false)}
            />
          )}
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
