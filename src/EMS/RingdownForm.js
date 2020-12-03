import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ApiService from '../ApiService';
import Ringdown from '../Models/Ringdown';

import HospitalSelection from './HospitalSelection';
import PatientFields from './PatientFields';

function RingdownForm({ className }) {
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
        console.log(response);
      })
      .catch((error) => {
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

  return (
    <>
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
