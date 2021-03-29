import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

import ApiService from '../ApiService';
import Context from '../Context';
import Ringdown from '../Models/Ringdown';
import Spinner from '../Components/Spinner';

import HospitalSelection from './HospitalSelection';
import PatientFields from './PatientFields';
import RingdownStatus from './RingdownStatus';

function RingdownForm({ className }) {
  const { ringdowns, setRingdowns } = useContext(Context);
  const [ringdown, setRingdown] = useState(new Ringdown());
  const [step, setStep] = useState(0);
  const [version, setVersion] = useState(0);

  function next() {
    setStep(1);
  }

  function send() {
    ApiService.ringdowns
      .create(ringdown.toJSON())
      .then((response) => {
        setRingdowns([response.data]);
        setRingdown(new Ringdown());
        setStep(0);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  function edit() {
    setStep(0);
  }

  function clear() {
    setRingdown(new Ringdown());
  }

  function onChange(property, value) {
    ringdown[property] = value;
    setVersion(version + 1);
  }

  function onStatusChange(rd, status) {
    // submit to server
    const now = new Date();
    ApiService.ringdowns.setDeliveryStatus(rd.id, status, now);
    // update local object for immediate feedback
    rd.currentDeliveryStatus = status;
    const isoNow = DateTime.fromJSDate(now).toISO();
    switch (status) {
      case Ringdown.Status.RETURNED_TO_SERVICE:
        // remove from list so that we go back to the ringdown form
        setRingdowns(ringdowns.filter((r) => r.id !== rd.id));
        return;
      default:
        rd.timestamps[status] = isoNow;
    }
    setRingdowns([...ringdowns]);
  }

  return (
    <>
      {ringdowns && ringdowns.length === 0 && (
        <form className={classNames('usa-form', className)}>
          <div className="usa-alert usa-alert--info usa-alert--slim usa-alert--no-icon">
            <div className="usa-alert__body">
              <p className="usa-alert__text">
                <span className="text-secondary-dark">*</span> Indicates a required field.
              </p>
            </div>
          </div>
          {step === 0 && <PatientFields onChange={onChange} ringdown={ringdown} />}
          {step === 1 && <HospitalSelection onChange={onChange} ringdown={ringdown} />}
          <fieldset className="usa-fieldset border-top border-base-lighter">
            {step === 0 && (
              <>
                <button disabled={!ringdown.isPatientValid} className="usa-button width-full" type="button" onClick={next}>
                  Select Hospital
                </button>
                <button className="usa-button usa-button--outline width-full margin-top-4" type="button" onClick={clear}>
                  Clear Form
                </button>
              </>
            )}
            {step === 1 && (
              <>
                <button disabled={!ringdown.isValid} className="usa-button width-full" type="button" onClick={send}>
                  Send Ringdown
                </button>
                <button className="usa-button usa-button--outline width-full margin-top-4" type="button" onClick={edit}>
                  Edit Ringdown
                </button>
              </>
            )}
          </fieldset>
        </form>
      )}
      {ringdowns && ringdowns.length > 0 && (
        <RingdownStatus className={className} onStatusChange={onStatusChange} ringdown={ringdowns[0]} />
      )}
      {!ringdowns && (
        <div className={classNames('padding-9', className)}>
          <Spinner />
        </div>
      )}
    </>
  );
}

RingdownForm.propTypes = {
  className: PropTypes.string,
};

RingdownForm.defaultProps = {
  className: null,
};

export default RingdownForm;
