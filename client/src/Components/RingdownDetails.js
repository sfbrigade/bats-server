import React from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import { FieldRow, PatientFieldRow, RingdownTable, Section } from './RingdownDetailsTable';

import './RingdownDetails.scss';

// create functions to do custom rendering of the field values
const toSentenceCase = (value) => (typeof value === 'string' ? value[0] + value.slice(1).toLowerCase() : value);
const stability = (value) => (value ? 'Stable' : 'Unstable');
const bp = (value, ringdown) => `${value} / ${ringdown.diastolicBloodPressure}`;
const suspected = (value) => value && 'Suspected';
const yes = (value) => value && 'Yes';
const temp = (value) => `${value}°F`;
const combative = (value, ringdown) => (value && 'Yes') + (ringdown.restraintIndicator ? ', restrained' : '');
const supplementalO2 = (value, ringdown) => {
  const { lowOxygenResponseType: type, supplementalOxygenAmount: amount } = ringdown;
  let response = '';

  if (type === 'ROOM AIR') {
    response = '(Gave room air)';
  } else if (type === 'SUPPLEMENTAL OXYGEN') {
    response = (
      <>
        (Gave {amount && <>{amount} L</>} O<sub>2</sub>)
      </>
    );
  }

  return (
    <>
      {value}% {response}
    </>
  );
};
const triagePriority = (value) => {
  switch (value) {
    case 'RED':
      return 'Immediate';
    case 'YELLOW':
      return 'Delayed';
    case 'GREEN':
      return 'Minor';
    default:
      return '';
  }
};

const { Status } = Ringdown;

function RingdownDetails({ className, onStatusChange, ringdown }) {
  const isMCI = !!ringdown.triageTag || !!ringdown.triagePriority;

  const isArrived = Status.is(ringdown.currentDeliveryStatus, Status.ARRIVED);
  const isOffloaded = Status.is(ringdown.currentDeliveryStatus, Status.OFFLOADED);

  return (
    <>
      {isMCI && (
        <div className="margin-top-2 margin-x-1 display-flex flex-justify-start">
          {!isArrived && (
            <button onClick={() => onStatusChange(ringdown, Status.ARRIVED)} className="usa-button width-auto">
              Mark&nbsp;Arrived
            </button>
          )}
          {isArrived && !isOffloaded && (
            <button onClick={() => onStatusChange(ringdown, Status.OFFLOADED)} className="usa-button width-auto">
              Mark&nbsp;Offloaded
            </button>
          )}
        </div>
      )}
      <RingdownTable ringdown={ringdown} className={className}>
        <Section title="Incident info">
          <FieldRow label="Agency" property="organizationName" />
          <FieldRow label="Unit #" property="ambulanceIdentifier" />
          <FieldRow label="Incident #" property="dispatchCallNumber" />
          <PatientFieldRow property="emergencyServiceResponseType" renderValue={toSentenceCase} />
        </Section>
        <Section title="Patient info">
          {!!ringdown.triageTag && <PatientFieldRow property="triageTag" />}
          {!!ringdown.triagePriority && <PatientFieldRow property="triagePriority" renderValue={triagePriority} />}
          <PatientFieldRow property="age" />
          <PatientFieldRow property="sex" renderValue={toSentenceCase} />
          <PatientFieldRow property="chiefComplaintDescription" />
          {/* we always want to show the vitals stability row, even when the value is false, so set the visible prop */}
          <PatientFieldRow property="stableIndicator" visible renderValue={stability} />
        </Section>
        <Section title="Vitals" visible={ringdown.hasVitals}>
          <FieldRow
            property="systolicBloodPressure"
            label="BP"
            visible={!!(ringdown.systolicBloodPressure || ringdown.diastolicBloodPressure)}
            renderValue={bp}
          />
          <PatientFieldRow property="heartRateBpm" />
          <PatientFieldRow property="respiratoryRate" />
          <PatientFieldRow property="oxygenSaturation" renderValue={supplementalO2} />
          <PatientFieldRow property="temperature" renderValue={temp} />
        </Section>
        <Section title="Additional notes" visible={ringdown.hasAdditionalNotes}>
          <PatientFieldRow property="treatmentNotes" />
          <PatientFieldRow property="etohSuspectedIndicator" renderValue={suspected} />
          <PatientFieldRow property="drugsSuspectedIndicator" renderValue={suspected} />
          <PatientFieldRow property="psychIndicator" renderValue={yes} />
          <PatientFieldRow property="combativeBehaviorIndicator" renderValue={combative} />
          <PatientFieldRow property="covid19SuspectedIndicator" renderValue={suspected} />
          <PatientFieldRow property="glasgowComaScale" />
          <PatientFieldRow property="otherObservationNotes" />
        </Section>
      </RingdownTable>
    </>
  );
}

RingdownDetails.propTypes = {
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
};

RingdownDetails.defaultProps = {
  className: null,
};

export default RingdownDetails;
