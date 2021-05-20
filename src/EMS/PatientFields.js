import React from 'react';
import PropTypes from 'prop-types';

import FormCheckbox from '../Components/FormCheckbox';
import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';
import FormRadioFieldSet from '../Components/FormRadioFieldSet';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import Ringdown from '../Models/Ringdown';

function PatientFields({ ringdown, onChange }) {
  function handleUserInput(updatedField, inputValue) {
    onChange(updatedField, inputValue);

    if (ringdown.validationData[updatedField]) {
      ringdown.validateData(updatedField, inputValue);
    } else {
      console.log("hello");
      ringdown.validateData('catchAll');
    }
  }

  return (
    <>
      <div className="usa-accordion">
        <Heading title="Unit Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <div className="margin-bottom-4" role="alert">
              <FormInput
                label="Unit #"
                onChange={handleUserInput}
                property="ambulanceIdentifier"
                required
                size="medium"
                value={ringdown.ambulanceIdentifier}
                validationState={ringdown.getValidationState('ambulanceIdentifier')}
              />
            </div>
            <div role="alert">
              <FormInput
                label="Incident #"
                onChange={handleUserInput}
                property="dispatchCallNumber"
                required
                size="medium"
                type="number"
                value={ringdown.dispatchCallNumber}
                validationState={ringdown.getValidationState('dispatchCallNumber')}
              />
            </div>
          </fieldset>
        </div>
        <Heading title="Patient Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <div role="alert">
              <FormInput
                label="Age (estim.)"
                onChange={handleUserInput}
                property="age"
                required
                size="small"
                type="number"
                unit="years"
                value={ringdown.age}
                validationState={ringdown.getValidationState('age')}
              />
            </div>
          </fieldset>
          <FormRadioFieldSet
            labelText="Gender Identity"
            formRadios={[
              <FormRadio currentValue={ringdown.sex} label="Male" onChange={handleUserInput} property="sex" value="MALE" />,
              <FormRadio currentValue={ringdown.sex} label="Female" onChange={handleUserInput} property="sex" value="FEMALE" />,
              <FormRadio currentValue={ringdown.sex} label="Non-binary" onChange={handleUserInput} property="sex" value="NON-BINARY" />,
            ]}
            property="sex"
            isRequired
            validationState={ringdown.getValidationState('sex')}

          />
          <FormRadioFieldSet
            labelText="Urgency"
            formRadios={[
              <FormRadio
                currentValue={ringdown.emergencyServiceResponseType}
                label="Code 2"
                onChange={handleUserInput}
                property="emergencyServiceResponseType"
                value="CODE 2"
              />,
              <FormRadio
                currentValue={ringdown.emergencyServiceResponseType}
                label="Code 3"
                onChange={handleUserInput}
                property="emergencyServiceResponseType"
                value="CODE 3"
              />,
            ]}
            property="emergencyServiceResponseType"
            isRequired
            validationState={ringdown.getValidationState('emergencyServiceResponseType')}
          />
          <fieldset className="usa-fieldset">
            <div role="alert">
              <label className="usa-label usa-label--required" htmlFor="chiefComplaintDescription">
                Chief Complaint
              </label>
              <FormTextArea
                label=""
                onChange={handleUserInput}
                property="chiefComplaintDescription"
                value={ringdown.chiefComplaintDescription}
                validationState={ringdown.getValidationState('chiefComplaintDescription')}
              />
              <div className="usa-hint usa-hint--important">
                <i className="fas fa-info-circle" /> Exclude identifying information.
              </div>
            </div>
          </fieldset>
          <FormRadioFieldSet
            labelText="Vitals Stability"
            formRadios={[
              <FormRadio
                currentValue={ringdown.stableIndicator}
                label="Vitals stable"
                onChange={handleUserInput}
                property="stableIndicator"
                value={true}
              />,
              <FormRadio
                currentValue={ringdown.stableIndicator}
                label="Vitals not stable"
                onChange={handleUserInput}
                property="stableIndicator"
                value={false}
              />
            ]}
            property="stableIndicator"
            validationState={ringdown.getValidationState('stableIndicator')}
            isRequired
          />
        </div>
        <div type="alert">
          <Heading title="Vitals" subtitle="(optional)" />
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <FormInput
                label="Blood Pressure"
                onChange={handleUserInput}
                property="systolicBloodPressure"
                size="small"
                type="number"
                unit="/"
                value={ringdown.systolicBloodPressure}
              >
                <FormInput
                  onChange={handleUserInput}
                  isWrapped={false}
                  property="diastolicBloodPressure"
                  size="small"
                  type="number"
                  unit="mmHg"
                  value={ringdown.diastolicBloodPressure}
                />
              </FormInput>
              <FormInput
                label="Pulse"
                onChange={handleUserInput}
                property="heartRateBpm"
                size="small"
                type="number"
                unit="bpm"
                value={ringdown.heartRateBpm}
              />
              <FormInput
                label="Respiratory Rate"
                onChange={handleUserInput}
                property="respiratoryRate"
                size="small"
                type="number"
                unit="breath/m"
                value={ringdown.respiratoryRate}
              />
              <FormInput
                label="SpO2"
                onChange={handleUserInput}
                property="oxygenSaturation"
                size="small"
                type="number"
                unit="%"
                value={ringdown.oxygenSaturation}
              />
              <div className="padding-left-4">
                <FormRadio
                  currentValue={ringdown.lowOxygenResponseType}
                  disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
                  label="RA"
                  onChange={handleUserInput}
                  property="lowOxygenResponseType"
                  value="ROOM AIR"
                />
                <div className="display-flex flex-row flex-align-center margin-top-2">
                  <FormRadio
                    currentValue={ringdown.lowOxygenResponseType}
                    disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
                    label="O2"
                    onChange={handleUserInput}
                    property="lowOxygenResponseType"
                    value="SUPPLEMENTAL OXYGEN"
                  />
                  <div className="margin-left-4">
                    <FormInput
                      disabled={ringdown.lowOxygenResponseType !== 'SUPPLEMENTAL OXYGEN'}
                      onChange={handleUserInput}
                      property="supplementalOxygenAmount"
                      size="small"
                      type="number"
                      unit="L"
                      value={ringdown.supplementalOxygenAmount}
                    />
                  </div>
                </div>
              </div>
              <FormInput
                label="Temp."
                onChange={handleUserInput}
                property="temperature"
                size="small"
                type="number"
                unit="&deg;F"
                value={ringdown.temperature}
              />
            </fieldset>
          </div>
          <Heading title="Additional notes" subtitle="(optional)" />
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <FormCheckbox
                currentValue={ringdown.etohSuspectedIndicator}
                label="ETOH suspected"
                onChange={handleUserInput}
                property="etohSuspectedIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.drugsSuspectedIndicator}
                label="Drugs suspected"
                onChange={handleUserInput}
                property="drugsSuspectedIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.psychIndicator}
                label="Psych patient"
                onChange={handleUserInput}
                property="psychIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.combativeBehaviorIndicator}
                label="Combative"
                onChange={handleUserInput}
                property="combativeBehaviorIndicator"
                value={true}
              />
              <div className="padding-left-4">
                <FormCheckbox
                  currentValue={ringdown.restraintIndicator}
                  disabled={ringdown.combativeBehaviorIndicator !== true}
                  label="4-point restraint"
                  onChange={handleUserInput}
                  property="restraintIndicator"
                  value={true}
                />
              </div>
              <FormCheckbox
                currentValue={ringdown.covid19SuspectedIndicator}
                label="COVID-19 suspected"
                onChange={handleUserInput}
                property="covid19SuspectedIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.ivIndicator}
                label="IV started"
                onChange={handleUserInput}
                property="ivIndicator"
                value={true}
              />
              <FormTextArea label="Other" onChange={onChange} property="otherObservationNotes" value={ringdown.otherObservationNotes} />
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
}

PatientFields.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PatientFields;
