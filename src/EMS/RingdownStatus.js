import React from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';

function RingdownStatus({ className, onStatusChange, ringdown }) {
  return (
    <div className={classNames('usa-accordion', className)}>
      <div className="usa-accordion__content">
        <fieldset className="usa-fieldset">
          <h3 className="h1 margin-0">{ringdown.hospital.name}</h3>
          <h4 className="text-base-light margin-top-2">ETA {ringdown.patientDelivery.etaMinutes} minutes</h4>
          <ol className="status-list">
            <li className="status-list-item status-list-item--completed">
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                Ringdown sent{' '}
                <span>
                  {DateTime.fromISO(ringdown.patientDelivery.ringdownSentDateTimeLocal).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                </span>
              </div>
            </li>
            <li
              className={classNames('status-list-item', {
                'status-list-item--noninteractive': !ringdown.patientDelivery.ringdownReceivedDateTimeLocal,
                'status-list-item--completed': ringdown.patientDelivery.ringdownReceivedDateTimeLocal,
              })}
            >
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                Ringdown received
                {ringdown.patientDelivery.ringdownReceivedDateTimeLocal && (
                  <span>
                    {DateTime.fromISO(ringdown.patientDelivery.ringdownReceivedDateTimeLocal).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                  </span>
                )}
              </div>
            </li>
            <li
              className={classNames('status-list-item', {
                'status-list-item--completed':
                  Ringdown.Status.ALL_STATUSES.indexOf(ringdown.patientDelivery.deliveryStatus) >=
                  Ringdown.Status.ALL_STATUSES.indexOf(Ringdown.Status.ARRIVED),
              })}
            >
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                {ringdown.patientDelivery.deliveryStatus === Ringdown.Status.RINGDOWN_RECEIVED && (
                  <button
                    onClick={() => onStatusChange(ringdown, Ringdown.Status.ARRIVED)}
                    className="usa-button usa-button--primary width-full"
                    type="button"
                  >
                    Mark arrived
                  </button>
                )}
                {ringdown.patientDelivery.deliveryStatus !== Ringdown.Status.RINGDOWN_RECEIVED && 'Arrived at ED'}
                {ringdown.patientDelivery.arrivedDateTimeLocal && (
                  <span>
                    {DateTime.fromISO(ringdown.patientDelivery.arrivedDateTimeLocal).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                  </span>
                )}
              </div>
            </li>
            <li
              className={classNames('status-list-item', {
                'status-list-item--completed':
                  Ringdown.Status.ALL_STATUSES.indexOf(ringdown.patientDelivery.deliveryStatus) >=
                  Ringdown.Status.ALL_STATUSES.indexOf(Ringdown.Status.OFFLOADED),
              })}
            >
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                {ringdown.patientDelivery.deliveryStatus === Ringdown.Status.ARRIVED && (
                  <button
                    onClick={() => onStatusChange(ringdown, Ringdown.Status.OFFLOADED)}
                    className="usa-button usa-button--primary width-full"
                    type="button"
                  >
                    Mark offloaded
                  </button>
                )}
                {ringdown.patientDelivery.deliveryStatus !== Ringdown.Status.ARRIVED && 'Patient offloaded'}
                {ringdown.patientDelivery.offloadedDateTimeLocal && (
                  <span>
                    {DateTime.fromISO(ringdown.patientDelivery.offloadedDateTimeLocal).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
                  </span>
                )}
              </div>
            </li>
            <li className="status-list-item">
              <div className="status-list-item__icon" />
              <div className="status-list-item__text">
                {ringdown.patientDelivery.deliveryStatus === Ringdown.Status.OFFLOADED && (
                  <button
                    onClick={() => onStatusChange(ringdown, Ringdown.Status.RETURNED_TO_SERVICE)}
                    className="usa-button usa-button--primary width-full"
                    type="button"
                  >
                    Return to service
                  </button>
                )}
                {ringdown.patientDelivery.deliveryStatus !== Ringdown.Status.OFFLOADED && 'Return to service'}
              </div>
            </li>
          </ol>
        </fieldset>
        <fieldset className="usa-fieldset border-top border-base-lighter">
          <button className="usa-button usa-button--outline usa-button--secondary width-full" type="button">
            Redirect patient
          </button>
          <button className="usa-button usa-button--secondary width-full margin-top-4" type="button">
            Cancel delivery
          </button>
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
