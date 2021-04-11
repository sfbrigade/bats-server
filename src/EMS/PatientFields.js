import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormCheckbox from '../Components/FormCheckbox';
import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import Ringdown from '../Models/Ringdown';

import './PatientFields.scss';
import '../Components/FormInput.scss';

// Constants that represent the possible states for an input field
const InputState = {
  NO_INPUT: 'NO_INPUT',
  ERROR: 'ERROR',
  FIXED: 'FIXED',
};
Object.freeze(InputState);

// Data object that stores all of the info required to validate an input field
class PatientFieldData {
  constructor(fieldName, fieldOrder, inputState) {
    this.name = fieldName;
    this.order = fieldOrder;
    this.inputState = inputState;
  }
}

/**
 * Compare function used to sort an array of PatientFieldData
 * @param {*} a the first PatientFieldData object
 * @param {*} b the second PatientFieldData object
 * @return -1 if a comes before b, 0 if a equals b, 1 if b comes before a
 */
function ascendingByOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order === b.order) {
    return 0;
  }
  return 1;
}

function PatientFields({ ringdown, onChange }) {
  const [changeStatus, setChangeStatus] = useState(false);

  const [fieldData, setFieldData] = useState({
    ambulanceIdentifier: new PatientFieldData('ambulanceIdentifier', 0, InputState.NO_INPUT),
    dispatchCallNumber: new PatientFieldData('dispatchCallNumber', 1, InputState.NO_INPUT),
    age: new PatientFieldData('age', 2, InputState.NO_INPUT),
    // TODO - add the rest
  });

  /**
   * Given an updated input field and a dictionary the current state of all fields, output the
   * new state for all fields
   *
   * @param {*} updatedField The field that was updated
   * @param {*} fieldData A dictionary containing all PatientFieldData objects
   * @returns A new dictionary containing the updated PatientFieldData objects
   */
  function updateFieldData(updatedField, fieldData) {
    const updatedData = { ...fieldData };

    // 1. Handle the updated field
    //  - if status was ERROR, then set it to fixed
    //  - if status was NO_INPUT or FIXED, no need to do anything
    if (updatedData[updatedField].inputState === InputState.ERROR) {
      updatedData[updatedField].inputState = InputState.FIXED;
    }

    // 2. Possibly update the input state for fields before the updated field
    //  - Sort the fields in ascending order
    //  - Start at the field before the current field and iterate through the fields in descending order
    //  - if input state is NO_INPUT, set it to error
    //  - if status was ERROR or FIXED, no need to do anything
    const partition = updatedData[updatedField].order - 1;
    const sorted = Object.values(updatedData).sort(ascendingByOrder);
    for (let i = partition; i >= 0; i--) {
      if (sorted[i].inputState === InputState.NO_INPUT) {
        const fieldName = sorted[i].name;
        updatedData[fieldName].inputState = InputState.ERROR;
      }
    }
    return updatedData;
  }

  /**
   * Update the UI based on the user interaction
   * @param {*} updatedField the field that was interacted with
   */
  function handleUserInput(updatedField, inputValue) {
    console.log(`UPDATED FIELD IS ${updatedField}`);
    console.log(`INPUT VALUE IS ${inputValue}`);
    // call the callback passed in from the parent component
    onChange();

    // update field states
    const updatedData = updateFieldData(updatedField, fieldData);
    console.log(`UPDATED FIELD DATA IS \n ${JSON.stringify(updatedData)}`);
    setFieldData(updatedData);
  }

  /**
   * Convert a PatientFieldState to a FormInput class name
   * @param {*} patientFieldState the current PatientFieldState
   * @returns the class name that should be applied
   */
  function stateToClassName(inputFieldState) {
    switch (inputFieldState) {
      case InputState.FIXED:
        // TODO - replace this with a success case
        return '';
      case InputState.ERROR:
        return 'forminput__error';
      default:
        return '';
    }
  }

  function handleClick(field) {
    ringdown.currentField = field;

    const invalidValidStatus = ringdown.getErrorAndSuccesFields;
    ringdown.missingFields = invalidValidStatus[0];
    ringdown.fixedFields = invalidValidStatus[1];

    for (let i = 0; i < invalidValidStatus[0].length; i += 1) {
      const validator = `${invalidValidStatus[0][i]}Validator`;
      ringdown[validator] = `${invalidValidStatus[0][i]}_red`;
    }
    for (let i = 0; i < invalidValidStatus[1].length; i += 1) {
      const validator = `${invalidValidStatus[1][i]}Validator`;
      ringdown[validator] = `${invalidValidStatus[1][i]}_fixed`;
    }

    setChangeStatus(!changeStatus);
  }

  return (
    <>
      <div className="usa-accordion">
        <Heading title="Unit Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <div className={stateToClassName(fieldData.ambulanceIdentifier.inputState)}>
              <FormInput
                label="Unit #"
                onChange={handleUserInput}
                property="ambulanceIdentifier"
                required
                size="medium"
                value={ringdown.ambulanceIdentifier}
              />
            </div>
            <div role="alert" className={stateToClassName(fieldData.dispatchCallNumber.inputState)}>
              <FormInput
                label="Incident #"
                onChange={handleUserInput}
                property="dispatchCallNumber"
                required
                size="medium"
                type="number"
                value={ringdown.dispatchCallNumber}
              />
            </div>
          </fieldset>
        </div>
        <Heading title="Patient Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <div role="alert" className={stateToClassName(fieldData.age.inputState)}>
              <FormInput
                label="Age (estim.)"
                onChange={handleUserInput}
                property="age"
                required
                size="small"
                type="number"
                unit="years"
                value={ringdown.age}
              />
            </div>
          </fieldset>
          <fieldset className="usa-fieldset">
            <div role="alert" className={ringdown.sexValidator} onClick={() => handleClick('sex')}>
              <label className="usa-label usa-label--required" htmlFor="sex">
                Gender Identity
              </label>
              <FormRadio currentValue={ringdown.sex} label="Male" onChange={onChange} property="sex" value="MALE" />
              <FormRadio currentValue={ringdown.sex} label="Female" onChange={onChange} property="sex" value="FEMALE" />
              <FormRadio currentValue={ringdown.sex} label="Non-binary" onChange={onChange} property="sex" value="NON-BINARY" />
            </div>
          </fieldset>
          <fieldset className="usa-fieldset">
            <div
              role="alert"
              className={ringdown.emergencyServiceResponseTypeValidator}
              onClick={() => handleClick('emergencyServiceResponseType')}
            >
              <label className="usa-label usa-label--required" htmlFor="emergencyServiceResponseType">
                Urgency
              </label>
              <FormRadio
                currentValue={ringdown.emergencyServiceResponseType}
                label="Code 2"
                onChange={onChange}
                property="emergencyServiceResponseType"
                value="CODE 2"
              />
              <FormRadio
                currentValue={ringdown.emergencyServiceResponseType}
                label="Code 3"
                onChange={onChange}
                property="emergencyServiceResponseType"
                value="CODE 3"
              />
            </div>
          </fieldset>
          <fieldset className="usa-fieldset">
            <div
              role="alert"
              className={ringdown.chiefComplaintDescriptionValidator}
              onClick={() => handleClick('chiefComplaintDescription')}
            >
              <label className="usa-label usa-label--required" htmlFor="chiefComplaintDescription">
                Chief Complaint
              </label>
              <FormTextArea label="" onChange={onChange} property="chiefComplaintDescription" value={ringdown.chiefComplaintDescription} />
              <div className="usa-hint usa-hint--important">
                <i className="fas fa-info-circle" /> Exclude identifying information.
              </div>
            </div>
          </fieldset>
          <fieldset className="usa-fieldset">
            <div role="alert" className={ringdown.stableIndicatorValidator} onClick={() => handleClick('stableIndicator')}>
              <label className="usa-label usa-label--required" htmlFor="stableIndicator">
                Vitals Stability
              </label>
              <FormRadio
                currentValue={ringdown.stableIndicator}
                label="Vitals stable"
                onChange={onChange}
                property="stableIndicator"
                value={true}
              />
              <FormRadio
                currentValue={ringdown.stableIndicator}
                label="Vitals not stable"
                onChange={onChange}
                property="stableIndicator"
                value={false}
              />
            </div>
          </fieldset>
        </div>
        <div type="alert" onClick={() => handleClick('end')}>
          <Heading title="Vitals" subtitle="(optional)" />
          <div className="usa-accordion__content">
            <fieldset className="usa-fieldset">
              <FormInput
                label="Blood Pressure"
                onChange={onChange}
                property="systolicBloodPressure"
                size="small"
                type="number"
                unit="/"
                value={ringdown.systolicBloodPressure}
              >
                &nbsp;&nbsp;
                <FormInput
                  onChange={onChange}
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
                onChange={onChange}
                property="heartRateBpm"
                size="small"
                type="number"
                unit="bpm"
                value={ringdown.heartRateBpm}
              />
              <FormInput
                label="Respiratory Rate"
                onChange={onChange}
                property="respiratoryRate"
                size="small"
                type="number"
                unit="breath/m"
                value={ringdown.respiratoryRate}
              />
              <FormInput
                label="SpO2"
                onChange={onChange}
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
                  onChange={onChange}
                  property="lowOxygenResponseType"
                  value="ROOM AIR"
                />
                <div className="display-flex flex-row flex-align-center margin-top-2">
                  <FormRadio
                    currentValue={ringdown.lowOxygenResponseType}
                    disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
                    label="O2"
                    onChange={onChange}
                    property="lowOxygenResponseType"
                    value="SUPPLEMENTAL OXYGEN"
                  />
                  <div className="margin-left-4">
                    <FormInput
                      disabled={ringdown.lowOxygenResponseType !== 'SUPPLEMENTAL OXYGEN'}
                      onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
                property="etohSuspectedIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.drugsSuspectedIndicator}
                label="Drugs suspected"
                onChange={onChange}
                property="drugsSuspectedIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.psychIndicator}
                label="Psych patient"
                onChange={onChange}
                property="psychIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.combativeBehaviorIndicator}
                label="Combative"
                onChange={onChange}
                property="combativeBehaviorIndicator"
                value={true}
              />
              <div className="padding-left-4">
                <FormCheckbox
                  currentValue={ringdown.restraintIndicator}
                  disabled={ringdown.combativeBehaviorIndicator !== true}
                  label="4-point restraint"
                  onChange={onChange}
                  property="restraintIndicator"
                  value={true}
                />
              </div>
              <FormCheckbox
                currentValue={ringdown.covid19SuspectedIndicator}
                label="COVID-19 suspected"
                onChange={onChange}
                property="covid19SuspectedIndicator"
                value={true}
              />
              <FormCheckbox
                currentValue={ringdown.ivIndicator}
                label="IV started"
                onChange={onChange}
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
