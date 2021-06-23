import React, { useState } from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';

import FormCheckbox from '../Components/FormCheckbox';
import FormInput from '../Components/FormInput';
import FormRadio from '../Components/FormRadio';
import FormTextArea from '../Components/FormTextArea';
import Heading from '../Components/Heading';
import Ringdown from '../Models/Ringdown';
import ComboBox from '../Components/ComboBox';



function PatientFields({ ringdown, onChange }) {

    
    // const [data, setData] = useState(null)

    // useEffect(async () => {
    //   const result = await axios(
    //     '/ambulance-ids',
    //   );
    //   setData(result.data);
    // }, []);

    // console.log(data)



  return (
    <>
      <div className="usa-accordion">
        <Heading title="Unit Info" />
        <div className="usa-accordion__content">
         
          <fieldset className="usa-fieldset">

            <ComboBox
              label="Unit #"
              property="ambulanceIdentifier"
              required
              onChange={onChange}
              value={ringdown.ambulanceIdentifier}
              />
              
              <ComboBox
              label="Incident #"
              property="dispatchCallNumber"
              required
              onChange={onChange}
              value={ringdown.dispatchCallNumber}
              />
          
          </fieldset>
        </div>
        <Heading title="Patient Info" />
        <div className="usa-accordion__content">
          <fieldset className="usa-fieldset">
            <FormInput
              label="Age (estim.)"
              onChange={onChange}
              property="age"
              required
              size="small"
              type="number"
              unit="years"
              value={ringdown.age}
            />
          </fieldset>
          <fieldset className="usa-fieldset">
            <label className="usa-label usa-label--required" htmlFor="sex">
              Gender Identity
            </label>
            <FormRadio currentValue={ringdown.sex} label="Male" onChange={onChange} property="sex" value="MALE" />
            <FormRadio currentValue={ringdown.sex} label="Female" onChange={onChange} property="sex" value="FEMALE" />
            <FormRadio currentValue={ringdown.sex} label="Non-binary" onChange={onChange} property="sex" value="NON-BINARY" />
          </fieldset>
          <fieldset className="usa-fieldset">
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
          </fieldset>
          <fieldset className="usa-fieldset">
            <FormTextArea
              label="Chief Complaint"
              onChange={onChange}
              property="chiefComplaintDescription"
              value={ringdown.chiefComplaintDescription}
            />
            <div className="usa-hint usa-hint--important">
              <i className="fas fa-info-circle" /> Exclude identifying information.
            </div>
          </fieldset>
          <fieldset className="usa-fieldset">
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
          </fieldset>
        </div>
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
            <FormCheckbox currentValue={ringdown.ivIndicator} label="IV started" onChange={onChange} property="ivIndicator" value={true} />
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
