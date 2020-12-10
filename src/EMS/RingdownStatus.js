import React from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import './RingdownStatus.scss';

function RingdownStatus({ ringdown }) {
  return (
    <>
      <div className="usa-accordion">
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <h3 className="h1">{ringdown.hospital.name}</h3>
            <h4 className="text-base-light">ETA {ringdown.patientDelivery.etaMinutes} minutes</h4>
            <ol className="status-list">
              <li className="status-list-item status-list-item--completed">
                <div className="status-list-item__icon"></div>
                <div className="status-list-item__text">
                  Ringdown sent <span>{DateTime.fromISO(ringdown.patientDelivery.ringdownSentDateTimeLocal).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}</span>
                </div>
              </li>
              <li className="status-list-item status-list-item--noninteractive">
                <div className="status-list-item__icon"></div>
                <div className="status-list-item__text">
                  Ringdown received
                </div>
              </li>
              <li className="status-list-item">
                <div className="status-list-item__icon"></div>
                <div className="status-list-item__text">
                  Arrived at ED
                </div>
              </li>
              <li className="status-list-item">
                <div className="status-list-item__icon"></div>
                <div className="status-list-item__text">
                  Patient offloaded
                </div>
              </li>
              <li className="status-list-item">
                <div className="status-list-item__icon"></div>
                <div className="status-list-item__text">
                  Returned to service
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
    </>
  );
}

RingdownStatus.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
};

export default RingdownStatus;
