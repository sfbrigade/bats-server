import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import FormCheckbox from '../Components/FormCheckbox';
import FormComboBox from '../Components/FormComboBox';
import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';
import FormRadioFieldSet from '../Components/FormRadioFieldSet';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';

import Ringdown from '../Models/Ringdown';
import ApiService from '../ApiService';
import Context from '../Context';

const INPUT_RANGES = {
  systolicBloodPressure: { min: 90, max: 180 },
  diastolicBloodPressure: { min: 60, max: 120 },
  heartRateBpm: { min: 40, max: 200 },
  respiratoryRate: { min: 12, max: 25 },
  oxygenSaturation: { min: 0, max: 100 },
  temperature: { min: 80, max: 150 },
};

function getRange(property, extreme) {
  return INPUT_RANGES[property] ? INPUT_RANGES[property][extreme] : null;
}

function PatientFields({ ringdown, onChange }) {
  const [ambulanceIds, setAmbulanceIds] = useState([]);
  const [dispatchCallNumbers, setDispatchCallNumbers] = useState([]);
  const { user } = useContext(Context);

  useEffect(() => {
    if (user) {
      ApiService.ambulances.getIdentifiers(user.organization.id).then((response) => {
        setAmbulanceIds(response.data.ambulanceIdentifiers);
      });
      if (ringdown.ambulanceIdentifier) {
        ApiService.emsCalls.getDispatchCallNumbers(ringdown.ambulanceIdentifier).then((response) => {
          setDispatchCallNumbers(response.data.dispatchCallNumbers);
        });
      }
    }
  }, [ringdown.ambulanceIdentifier, user]);

  function createOptions(ids) {
    const options = [];
    ids.forEach((id) =>
      options.push(
        <option key={id} value={id}>
          {id}
        </option>
      )
    );
    return options;
  }

  function handleUserInput(updatedField, inputValue) {
    onChange(updatedField, inputValue);
  }

  return (
    <>
      <div className="usa-accordion">
        <Heading title="Unit Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <FormComboBox
              label="Unit #"
              property="ambulanceIdentifier"
              required
              onChange={handleUserInput}
              options={createOptions(ambulanceIds)}
              validationState={ringdown.getValidationState('ambulanceIdentifier')}
              value={ringdown.ambulanceIdentifier}
            />
          </fieldset>
          <fieldset className="usa-fieldset">
            <FormComboBox
              label="Incident #"
              property="dispatchCallNumber"
              required
              onChange={handleUserInput}
              options={createOptions(dispatchCallNumbers)}
              validationState={ringdown.getValidationState('dispatchCallNumber')}
              value={ringdown.dispatchCallNumber}
            />
          </fieldset>
        </div>
        <Heading title="Patient Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
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
          </fieldset>
          <FormRadioFieldSet labelText="Gender Identity" property="sex" isRequired validationState={ringdown.getValidationState('sex')}>
            <FormRadio currentValue={ringdown.sex} label="Male" onChange={handleUserInput} property="sex" value="MALE" />
            <FormRadio currentValue={ringdown.sex} label="Female" onChange={handleUserInput} property="sex" value="FEMALE" />
            <FormRadio currentValue={ringdown.sex} label="Non-binary" onChange={handleUserInput} property="sex" value="NON-BINARY" />
          </FormRadioFieldSet>
          <FormRadioFieldSet
            labelText="Urgency"
            property="emergencyServiceResponseType"
            isRequired
            validationState={ringdown.getValidationState('emergencyServiceResponseType')}
          >
            <FormRadio
              currentValue={ringdown.emergencyServiceResponseType}
              label="Code 2"
              onChange={handleUserInput}
              property="emergencyServiceResponseType"
              value="CODE 2"
            />
            <FormRadio
              currentValue={ringdown.emergencyServiceResponseType}
              label="Code 3"
              onChange={handleUserInput}
              property="emergencyServiceResponseType"
              value="CODE 3"
              disabled
            />
          </FormRadioFieldSet>
          <fieldset className="usa-fieldset">
            <FormTextArea
              label="Chief Complaint"
              onChange={handleUserInput}
              property="chiefComplaintDescription"
              required
              value={ringdown.chiefComplaintDescription}
              validationState={ringdown.getValidationState('chiefComplaintDescription')}
            >
              <div className="usa-hint usa-hint--important">
                <i className="fas fa-info-circle" /> Exclude identifying information.
              </div>
            </FormTextArea>
          </fieldset>
          <FormRadioFieldSet
            labelText="Vitals Stability"
            property="stableIndicator"
            validationState={ringdown.getValidationState('stableIndicator')}
            isRequired
          >
            <FormRadio
              currentValue={ringdown.stableIndicator}
              label="Vitals stable"
              onChange={handleUserInput}
              property="stableIndicator"
              value={true}
            />
            <FormRadio
              currentValue={ringdown.stableIndicator}
              label="Vitals not stable"
              onChange={handleUserInput}
              property="stableIndicator"
              value={false}
            />
          </FormRadioFieldSet>
        </div>
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
              min={getRange('systolicBloodPressure', 'min')}
              max={getRange('systolicBloodPressure', 'max')}
              value={ringdown.systolicBloodPressure}
            >
              <FormInput
                onChange={handleUserInput}
                isWrapped={false}
                property="diastolicBloodPressure"
                size="small"
                type="number"
                unit="mmHg"
                min={getRange('diastolicBloodPressure', 'min')}
                max={getRange('diastolicBloodPressure', 'max')}
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
              min={getRange('heartRateBpm', 'min')}
              max={getRange('heartRateBpm', 'max')}
              value={ringdown.heartRateBpm}
            />
            <FormInput
              label="Respiratory Rate"
              onChange={handleUserInput}
              property="respiratoryRate"
              size="small"
              type="number"
              min={getRange('respiratoryRate', 'min')}
              max={getRange('respiratoryRate', 'max')}
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
              pattern="[0-9]*"
              min={getRange('oxygenSaturation', 'min')}
              max={getRange('oxygenSaturation', 'max')}
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
              min={getRange('temperature', 'min')}
              max={getRange('temperature', 'max')}
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
    </>
  );
}

PatientFields.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PatientFields;
