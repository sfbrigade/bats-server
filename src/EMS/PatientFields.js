import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, useForm } from '../Components/Form';
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

const Patient = patient.getFieldHash();

function getRange(property, extreme) {
  const { range } = Patient[property] || {};

  return range ? range[extreme] : null;
}

// use prop-spreading here because all we're doing is defaulting some props and letting the rest
// pass through to FormInput
function NumericField({ property, size = 'small', min = getRange(property, 'min'), max = getRange(property, 'max'), ...props }) {
  const { data, onChange } = useForm();

  return (
    <FormInput
      property={property}
      value={data[property]}
      size={size}
      min={min}
      max={max}
      type="number"
      validationState={data.getValidationState(property)}
      onChange={onChange}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );
}

NumericField.propTypes = FormInput.propTypes;

/* eslint-disable react/jsx-props-no-spreading */
function Field({ metadata, ...props }) {
  const { data, onChange } = useForm();
  const { name: property, type, label, unit, required } = metadata;
  const value = data[property];
  const commonProps = {
    property,
    label,
    value,
    required,
    onChange,
    validationState: data.getValidationState(property)
  };

	switch (type) {
    case 'integer':
    case 'decimal':
      return (
        <NumericField
          {...commonProps}
          unit={unit}
          {...props}
        />
      );

    case 'boolean':
      return (
        <FormCheckbox
          {...commonProps}
          currentValue={value}
          value={true}
          {...props}
        />
      );

    case 'text':
      return (
        <FormTextArea
          {...commonProps}
          {...props}
        />
      );

    default:
      throw new Error(`Unknown field type: ${type}`);
  }
}

function createOptions(ids) {
  return ids.map((id) => (
    <option
      key={id}
      value={id}
    >
      {id}
    </option>
  ));
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

  function handleUserInput(updatedField, inputValue) {
    onChange(updatedField, inputValue);
  }

  return (
    <Form data={ringdown} onChange={handleUserInput}>
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
            <Field metadata={Patient.age} />
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
            <Field metadata={Patient.chiefComplaintDescription}>
              <div className="usa-hint usa-hint--important">
                <i className="fas fa-info-circle" /> Exclude identifying information.
              </div>
            </Field>
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
            <Field
              metadata={Patient.systolicBloodPressure}
              label="Blood Pressure"
              unit="/"
            >
              <span className="usa-hint usa-hint--unit">&nbsp;&nbsp;</span>
              <Field
                metadata={Patient.diastolicBloodPressure}
                unit="mmHG"
                isWrapped={false}
              />
            </Field>
            <Field metadata={Patient.heartRateBpm} />
            <Field metadata={Patient.respiratoryRate} />
            <Field metadata={Patient.oxygenSaturation} />
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
                      <Field
                        metadata={Patient.supplementalOxygenAmount}
                        disabled={ringdown.lowOxygenResponseType !== 'SUPPLEMENTAL OXYGEN'}
                      />
                    </div>
                  }
                  value="SUPPLEMENTAL OXYGEN"
                  disabled={ringdown.oxygenSaturation === null || ringdown.oxygenSaturation === ''}
                />
              </FormRadioFieldSet>
            </div>
            <Field metadata={Patient.temperature} />
          </fieldset>
        </div>
        <Heading title="Additional Notes" subtitle="optional" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <Field metadata={Patient.treatmentNotes} />
            <Field metadata={Patient.etohSuspectedIndicator} />
            <Field metadata={Patient.drugsSuspectedIndicator} />
            <Field metadata={Patient.psychIndicator} />
            <Field metadata={Patient.combativeBehaviorIndicator} />
            <div className="padding-left-4">
              <Field metadata={Patient.restraintIndicator} disabled={ringdown.combativeBehaviorIndicator !== true} />
            </div>
            <Field metadata={Patient.covid19SuspectedIndicator} />
            <Field metadata={Patient.glasgowComaScale} />
            <Field metadata={Patient.otherObservationNotes} />
          </fieldset>
        </div>
      </div>
    </Form>
  );
}

PatientFields.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PatientFields;
