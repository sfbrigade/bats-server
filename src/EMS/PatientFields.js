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
import patient from '../metadata/patient';

const FIELDs = patient.getFieldHash();

function getRange(property, extreme) {
  const { range } = FIELDs[property] || {};

  return range ? range[extreme] : null;
}

// use prop-spreading here because all we're doing is defaulting some props and letting the rest
// pass through to FormInput
function NumericField({ property, size = 'small', min = getRange(property, 'min'), max = getRange(property, 'max'), ...props }) {
  return (
    <FormInput
      property={property}
      size={size}
      min={min}
      max={max}
      type="number"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );
}

NumericField.propTypes = FormInput.propTypes;

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
            <NumericField
              label="Age (estimated)"
              property="age"
              unit="years"
              value={ringdown.age}
              required
              validationState={ringdown.getValidationState('age')}
              onChange={handleUserInput}
            />
          </fieldset>
          <FormRadioFieldSet
            label="Gender Identity"
            property="sex"
            value={ringdown.sex}
            validationState={ringdown.getValidationState('sex')}
            required
            onChange={handleUserInput}
          >
            <FormRadio label="Male" value="MALE" />
            <FormRadio label="Female" value="FEMALE" />
            <FormRadio label="Non-binary" value="NON-BINARY" />
          </FormRadioFieldSet>
          <FormRadioFieldSet
            label="Urgency"
            property="emergencyServiceResponseType"
            value={ringdown.emergencyServiceResponseType}
            validationState={ringdown.getValidationState('emergencyServiceResponseType')}
            required
            onChange={handleUserInput}
          >
            <FormRadio label="Code 2" value="CODE 2" />
            <FormRadio label="Code 3" value="CODE 3" disabled={window.env.REACT_APP_DISABLE_CODE_3 === 'true'} />
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
            label="Vitals Stability"
            property="stableIndicator"
            value={ringdown.stableIndicator}
            validationState={ringdown.getValidationState('stableIndicator')}
            required
            onChange={handleUserInput}
          >
            <FormRadio label="Vitals stable" value={true} />
            <FormRadio label="Vitals not stable" value={false} />
          </FormRadioFieldSet>
        </div>
        <Heading title="Vitals" subtitle="optional" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <NumericField
              label="Blood Pressure"
              property="systolicBloodPressure"
              unit="/"
              value={ringdown.systolicBloodPressure}
              onChange={handleUserInput}
            >
              <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;</span>
              <NumericField
                isWrapped={false}
                property="diastolicBloodPressure"
                unit="mmHg"
                value={ringdown.diastolicBloodPressure}
                onChange={handleUserInput}
              />
            </NumericField>
            <NumericField label="Pulse" property="heartRateBpm" unit="beats/min" value={ringdown.heartRateBpm} onChange={handleUserInput} />
            <NumericField
              label="Respiratory Rate"
              property="respiratoryRate"
              unit="breaths/min"
              value={ringdown.respiratoryRate}
              onChange={handleUserInput}
            />
            <div className="padding-left-2 margin-bottom-neg-4">
              <FormRadioFieldSet property="lowOxygenResponseType" value={ringdown.lowOxygenResponseType} onChange={handleUserInput}>
                <FormRadio
                  label="Room Air"
                  value="ROOM AIR"
                  disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
                />
                <FormRadio
                  label={
                    <div className="display-flex flex-row flex-align-center position-relative" style={{ top: '-.8rem' }}>
                      <div className="display-inline-block margin-right-2">
                        O<sub>2</sub>
                      </div>
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
                  }
                  value="SUPPLEMENTAL OXYGEN"
                  disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
                />
              </FormRadioFieldSet>
            </div>
            <NumericField label="Temp." property="temperature" unit="&deg;F" value={ringdown.temperature} onChange={handleUserInput} />
          </fieldset>
        </div>
        <Heading title="Additional Notes" subtitle="optional" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <FormTextArea
              label="Treatments administered"
              property="treatmentNotes"
              value={ringdown.treatmentNotes}
              onChange={handleUserInput}
            />
            <FormCheckbox
              currentValue={ringdown.etohSuspectedIndicator}
              label="ETOH suspected"
              onChange={handleUserInput}
              property="etohSuspectedIndicator"
            />
            <FormCheckbox
              currentValue={ringdown.drugsSuspectedIndicator}
              label="Drugs suspected"
              onChange={handleUserInput}
              property="drugsSuspectedIndicator"
            />
            <FormCheckbox
              currentValue={ringdown.psychIndicator}
              label="Psych patient"
              onChange={handleUserInput}
              property="psychIndicator"
            />
            <FormCheckbox
              currentValue={ringdown.combativeBehaviorIndicator}
              label="Combative"
              onChange={handleUserInput}
              property="combativeBehaviorIndicator"
            />
            <div className="padding-left-4">
              <FormCheckbox
                currentValue={ringdown.restraintIndicator}
                disabled={ringdown.combativeBehaviorIndicator !== true}
                label="4-point restraint"
                onChange={handleUserInput}
                property="restraintIndicator"
              />
            </div>
            <FormCheckbox
              currentValue={ringdown.covid19SuspectedIndicator}
              label="COVID-19 suspected"
              onChange={handleUserInput}
              property="covid19SuspectedIndicator"
            />
            <NumericField
              label="GCS"
              property="glasgowComaScale"
              unit="/ 15"
              value={ringdown.glasgowComaScale}
              onChange={handleUserInput}
            />
            <FormTextArea
              label="Other"
              property="otherObservationNotes"
              value={ringdown.otherObservationNotes}
              onChange={handleUserInput}
            />
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
