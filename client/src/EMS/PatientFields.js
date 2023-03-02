import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import FormComboBox from '../Components/FormComboBox';
import FormRadio from '../Components/FormRadio';
import FormRadioFieldSet from '../Components/FormRadioFieldSet';
import FormField from '../Components/FormField';
import Heading from '../Components/Heading';
import BloodPressureField from './BloodPressureField';

import Ringdown from '../Models/Ringdown';
import ApiService from '../ApiService';
import Context from '../Context';
import patient from '../../../shared/metadata/patient';
import TemperatureField from './TemperatureField';

const Patient = patient.getFieldHash();

function createOptions(ids) {
  return ids.map((id) => (
    <option key={id} value={id}>
      {id}
    </option>
  ));
}

// prettier-ignore
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

  function handleUserInput(updatedField, inputValue) {
    onChange(updatedField, inputValue);
  }

  return (
    <div className="usa-accordion">
      <Heading title="Incident info" />
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
      </div>
      <Heading title="Patient info" />
      <div className="usa-accordion__content">
        <fieldset className="usa-fieldset">
          <FormField metadata={Patient.age} />
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
        <fieldset className="usa-fieldset">
          <FormField metadata={Patient.chiefComplaintDescription}>
            <div className="usa-hint usa-hint--important">
              <i className="fas fa-info-circle" /> Exclude identifying information.
            </div>
          </FormField>
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
          <BloodPressureField
            systolicMetadata={Patient.systolicBloodPressure}
            diastolicMetadata={Patient.diastolicBloodPressure}
          />
          <FormField metadata={Patient.heartRateBpm} />
          <FormField metadata={Patient.respiratoryRate} />
          <FormField metadata={Patient.oxygenSaturation} />
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
                    <FormField
                      metadata={Patient.supplementalOxygenAmount}
                      disabled={ringdown.lowOxygenResponseType !== 'SUPPLEMENTAL OXYGEN'}
                      // we don't want to wrap this input as inputs with min/max values resize differently in Chrome, which then causes
                      // the unit label to wrap to the next line, due to the `flex-wrap: wrap` in .grid-row
                      isWrapped={false}
                    />
                  </div>
                }
                value="SUPPLEMENTAL OXYGEN"
                disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
              />
            </FormRadioFieldSet>
          </div>
          {/* <FormField metadata={Patient.temperature} /> */}
          <TemperatureField temperatureMetadata={Patient.temperature} />
          {/* <FormField
            metadata={Patient.temperature}
            label="Temperature"
          >
            <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;</span>
            <FormField
              metadata={Patient.temperature.conversion}
              isWrapped={false}
              label={false}
            />
          </FormField> */}
        </fieldset>
      </div>
      <Heading title="Additional notes" subtitle="optional" />
      <div className="usa-accordion__content">
        <fieldset className="usa-fieldset">
          <FormField metadata={Patient.treatmentNotes} />
          <FormField metadata={Patient.etohSuspectedIndicator} />
          <FormField metadata={Patient.drugsSuspectedIndicator} />
          <FormField metadata={Patient.psychIndicator} />
          <FormField metadata={Patient.combativeBehaviorIndicator} />
          <div className="padding-left-4">
            <FormField metadata={Patient.restraintIndicator} disabled={ringdown.combativeBehaviorIndicator !== true} />
          </div>
          <FormField metadata={Patient.covid19SuspectedIndicator} />
          <FormField metadata={Patient.glasgowComaScale} />
          <FormField metadata={Patient.otherObservationNotes} />
        </fieldset>
      </div>
    </div>
  );
}

PatientFields.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PatientFields;
