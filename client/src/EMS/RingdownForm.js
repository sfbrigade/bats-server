import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import ApiService from '../ApiService';
import Context from '../Context';
import Ringdown from '../Models/Ringdown';
import Spinner from '../Components/Spinner';
import RingdownCard from '../Components/RingdownCard';
import Heading from '../Components/Heading';
import Alert from '../Components/Alert';
import Form from '../Components/Form';
import HospitalSelection from './HospitalSelection';
import PatientFields from './PatientFields';
import RingdownStatus from './RingdownStatus';

function RingdownForm({ defaultPayload, className }) {
  const { ringdowns, setRingdowns } = useContext(Context);
  const [ringdown, setRingdown] = useState(new Ringdown(defaultPayload));
  const [step, setStep] = useState(0);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  function next() {
    setStep(1);
  }

  function edit() {
    setStep(0);
  }

  function clear() {
    setShowConfirmClear(true);
  }

  function send() {
    ApiService.ringdowns
      .create(ringdown.toJSON())
      .then((response) => {
        setRingdowns([new Ringdown(response.data)]);
        setRingdown(new Ringdown());
        setStep(0);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });

    // when we're in development, log a URL that can be loaded to fill out the fields with the same values that we just submitted
    if (process.env.NODE_ENV === 'development') {
      const params = new URLSearchParams();
      const { host, pathname } = window.location;

      Object.keys(Ringdown.Fields).forEach((key) => {
        const value = ringdown[key];

        // collect all of the non-empty/non-false fields in a set of params
        if (value !== null && value !== undefined && (typeof value !== 'boolean' || value)) {
          params.set(key, value);
        }
      });

      console.log(`${host + pathname}?${params}`);
    }
  }

  function onChange(property, value) {
    ringdown[property] = value;
    ringdown.validatePatientField(property, value);
    setRingdown(new Ringdown(ringdown.payload, ringdown.validationData));
  }

  function handleConfirmClear() {
    setRingdown(new Ringdown());
    setShowConfirmClear(false);
    // scroll the HTML element to the top to show the user the form has been cleared
    document.documentElement.scrollTop = 0;
  }

  function handleCancelClear() {
    setShowConfirmClear(false);
  }

  function handleConfirmCancel() {
    setShowConfirmCancel(false);
  }

  function onStatusChange(rd, status) {
    // submit to server
    const now = new Date();
    ApiService.ringdowns.setDeliveryStatus(rd.id, status, now);
    // update local object for immediate feedback
    rd.currentDeliveryStatus = status;
    switch (status) {
      case Ringdown.Status.REDIRECTED:
        // create a new ringdown with the same patient data, but no hospital selected yet.  clone() clears the hospital, delivery status
        // and ETA properties of the cloned ringdown.
        setRingdown(rd.clone());
        next();
        return;
      case Ringdown.Status.CANCELLED:
        setShowConfirmCancel(true);
        return;
      case Ringdown.Status.RETURNED_TO_SERVICE:
        // remove from list so that we go back to the ringdown form
        setRingdowns(ringdowns.filter((r) => r.id !== rd.id));
        return;
      default:
        rd.timestamps[status] = DateTime.fromJSDate(now).toISO();
    }
    setRingdowns([...ringdowns]);
  }

  function onSubmit() {
    if (ringdown.isValid) {
      if (step === 0) {
        next();
      } else {
        send();
      }
    }
  }

  // prettier-ignore
  return (
    <>
      {ringdowns && ringdowns.length === 0 && (
        <Form
          data={ringdown}
          onChange={onChange}
          onSubmit={onSubmit}
          className={classNames('usa-form', className)}
        >
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
                <Heading title="Ringdown Overview" />
                <RingdownCard key={ringdown.id} className="margin-x-3 margin-y-2" ringdown={ringdown} />
              </>
            )}
          </fieldset>
          {showConfirmClear && (
            <Alert
              type="warning"
              title="Clear form?"
              message="All of the fields will be reset."
              destructive="Clear form"
              cancel="Keep editing"
              onDestructive={handleConfirmClear}
              onCancel={handleCancelClear}
            />
          )}
          {showConfirmCancel && (
            <Alert
              type="success"
              title="Delivery canceled"
              message="The hospital has been notified."
              primary="Start new form"
              onPrimary={handleConfirmCancel}
            />
          )}
        </Form>
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
